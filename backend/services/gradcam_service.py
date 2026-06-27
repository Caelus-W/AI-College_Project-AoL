import base64
import io
import numpy as np
import torch
import cv2
from PIL import Image

class GradCAM:
    """
    Implements Grad-CAM (Gradient-weighted Class Activation Mapping)
    specifically for the DenseNet121TB model.
    """
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        """
        Initializes GradCAM with target model and layer.
        
        Args:
            model (torch.nn.Module): The classification model.
            target_layer (torch.nn.Module): The convolutional layer to inspect.
        """
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.handlers = []
        self._register_hooks()
        
    def _register_hooks(self):
        """Registers forward and backward hooks to capture activations and gradients."""
        def forward_hook(module, input_val, output_val):
            # Save activations from the forward pass
            self.activations = output_val
            
        def backward_hook(module, grad_input, grad_output):
            # Save gradients from the backward pass
            self.gradients = grad_output[0]
            
        # Hook into the target layer
        self.handlers.append(self.target_layer.register_forward_hook(forward_hook))
        self.handlers.append(self.target_layer.register_full_backward_hook(backward_hook))
        
    def remove_hooks(self):
        """Removes registered hooks from the model to prevent memory leaks."""
        for handler in self.handlers:
            handler.remove()
        self.handlers.clear()
        
    def generate_heatmap(self, input_tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        """
        Generates the raw 2D Grad-CAM heatmap.
        
        Args:
            input_tensor (torch.Tensor): Image tensor of shape (1, 3, 224, 224).
            class_idx (int): Index of the class (e.g. 1 for Positive).
            
        Returns:
            np.ndarray: Normalised 2D heatmap of values [0, 1].
        """
        # Ensure tensor requires gradients
        input_tensor = input_tensor.clone().detach().requires_grad_(True)
        
        # Forward pass
        output = self.model(input_tensor)
        
        # Select target class logit score
        score = output[0, class_idx]
        
        # Zero gradients
        self.model.zero_grad()
        
        # Backward pass
        score.backward()
        
        # Retrieve activations and gradients
        # Shape: (1, 1024, H, W) where H, W = 7, 7 for DenseNet-121
        activations = self.activations.detach()
        gradients = self.gradients.detach()
        
        # Pool gradients (Global Average Pooling per channel)
        # Shape: (1024,)
        weights = torch.mean(gradients, dim=(2, 3))[0]
        
        # Compute weighted sum of activations
        heatmap = torch.zeros(activations.shape[2:], dtype=torch.float32, device=activations.device)
        for i, w in enumerate(weights):
            heatmap += w * activations[0, i, :, :]
            
        # Apply ReLU to retain only features that positively correlate with the class
        heatmap = torch.clamp(heatmap, min=0)
        
        # Convert to CPU and numpy array
        heatmap_np = heatmap.cpu().numpy()
        
        # Normalize to [0, 1] range
        val_max = np.max(heatmap_np)
        if val_max > 0:
            heatmap_np = heatmap_np / val_max
            
        return heatmap_np


def generate_gradcam_images(
    model: torch.nn.Module, 
    input_tensor: torch.Tensor, 
    original_pil: Image.Image,
    target_class_idx: int = 1,
    alpha: float = 0.4
) -> tuple[str, str, str]:
    """
    Generates Grad-CAM visualisations: original, heatmap, and overlay.
    
    Args:
        model (torch.nn.Module): The DenseNet121TB model.
        input_tensor (torch.Tensor): Preprocessed image tensor.
        original_pil (Image.Image): The original PIL Image.
        target_class_idx (int): Class to explain (default is 1 for Positive).
        alpha (float): Transparency coefficient for blending.
        
    Returns:
        tuple[str, str, str]: Base64 data URLs for (original, heatmap, overlay) images.
    """
    # Target the last layer of features (which is norm5 in DenseNet-121)
    target_layer = model.features.norm5
    
    # Initialize GradCAM
    cam = GradCAM(model, target_layer)
    
    try:
        # Generate the 2D heatmap
        heatmap = cam.generate_heatmap(input_tensor, target_class_idx)
    finally:
        # Crucial: Clean up hooks immediately to avoid GPU/CPU memory build-up
        cam.remove_hooks()
        
    # Convert original PIL image to OpenCV BGR format
    original_np = np.array(original_pil)
    original_bgr = cv2.cvtColor(original_np, cv2.COLOR_RGB2BGR)
    h, w, _ = original_bgr.shape
    
    # Resize heatmap to match the original image size
    heatmap_resized = cv2.resize(heatmap, (w, h))
    
    # Scale heatmap to [0, 255] and convert to uint8
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    
    # Apply JET colormap (blue to red, where red represents higher activation)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    
    # Overlay heatmap on original image: Blend BGR images
    overlay_bgr = cv2.addWeighted(original_bgr, 1.0 - alpha, heatmap_colored, alpha, 0)
    
    # Encode images to JPEG Base64 Data URLs
    # 1. Original
    _, buffer_orig = cv2.imencode('.jpg', original_bgr)
    b64_orig = f"data:image/jpeg;base64,{base64.b64encode(buffer_orig).decode()}"
    
    # 2. Heatmap
    _, buffer_heat = cv2.imencode('.jpg', heatmap_colored)
    b64_heat = f"data:image/jpeg;base64,{base64.b64encode(buffer_heat).decode()}"
    
    # 3. Overlay
    _, buffer_over = cv2.imencode('.jpg', overlay_bgr)
    b64_over = f"data:image/jpeg;base64,{base64.b64encode(buffer_over).decode()}"
    
    return b64_orig, b64_heat, b64_over
