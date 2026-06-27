import io
from PIL import Image
import torch
import torchvision.transforms as transforms

# Define standard DenseNet ImageNet transforms
# DenseNet-121 expects 224x224 input normalized with ImageNet mean and std
densenet_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocesses raw image bytes for DenseNet-121 inference.
    
    Args:
        image_bytes (bytes): The raw uploaded image bytes.
        
    Returns:
        torch.Tensor: Preprocessed tensor of shape (1, 3, 224, 224).
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert RGBA or grayscale to RGB
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Apply standard torchvision transforms
        tensor = densenet_transforms(image)
        
        # Add batch dimension: (3, 224, 224) -> (1, 3, 224, 224)
        tensor = tensor.unsqueeze(0)
        return tensor
    except Exception as e:
        raise ValueError(f"Failed to preprocess image: {str(e)}")

def load_image_as_pil(image_bytes: bytes) -> Image.Image:
    """
    Loads raw image bytes into an RGB PIL Image.
    
    Args:
        image_bytes (bytes): The raw uploaded image bytes.
        
    Returns:
        Image.Image: The RGB PIL Image.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != "RGB":
            image = image.convert("RGB")
        return image
    except Exception as e:
        raise ValueError(f"Invalid image data: {str(e)}")
