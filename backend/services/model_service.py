import os
import torch
import torch.nn.functional as F
from model.densenet import DenseNet121TB

class ModelService:
    """
    Service responsible for loading the trained DenseNet121TB PyTorch model 
    and performing prediction/inference.
    """
    def __init__(self, model_path: str = None):
        """
        Initializes the ModelService and loads the model checkpoint.
        
        Args:
            model_path (str, optional): Absolute path to best_model.pth.
                                       Defaults to loading from the project root.
        """
        if model_path is None:
            # Find project root (3 directories up from this service file)
            service_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(service_dir))
            model_path = os.path.join(project_root, 'best_model.pth')
            
        self.model_path = model_path
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self._load_model()
        
    def _load_model(self) -> DenseNet121TB:
        """
        Loads the model architecture and state dictionary.
        
        Returns:
            DenseNet121TB: The initialized and loaded PyTorch model in eval mode.
        """
        model = DenseNet121TB(pretrained=False)
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model file not found at '{self.model_path}'. "
                "Please generate the dummy weights or run the training script first."
            )
            
        # Load weights and map to the appropriate device (CPU/GPU)
        state_dict = torch.load(self.model_path, map_location=self.device)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model
        
    def predict(self, input_tensor: torch.Tensor):
        """
        Runs model inference on a preprocessed X-ray image tensor.
        
        Args:
            input_tensor (torch.Tensor): Preprocessed image tensor of shape (1, 3, 224, 224).
            
        Returns:
            dict: Dictionary containing label ("Positive" / "Negative") and confidence score.
        """
        # Run forward pass (no gradients needed for standard inference)
        with torch.no_grad():
            input_tensor = input_tensor.to(self.device)
            logits = self.model(input_tensor)
            
            # Apply softmax to get probabilities: [Negative, Positive]
            probabilities = F.softmax(logits, dim=1)
            
            # Extract predicted class and confidence
            pred_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0, pred_idx].item()
            
            label = "Positive" if pred_idx == 1 else "Negative"
            
            return {
                "label": label,
                "confidence": confidence,
                "probabilities": {
                    "Negative": probabilities[0, 0].item(),
                    "Positive": probabilities[0, 1].item()
                }
            }
