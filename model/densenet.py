import torch
import torch.nn as nn
import torchvision.models as models

class DenseNet121TB(nn.Module):
    """
    DenseNet-121 architecture modified for binary classification of Tuberculosis.
    Outputs two logits: [Negative, Positive].
    """
    def __init__(self, pretrained: bool = False):
        """
        Initializes the DenseNet-121 model.
        
        Args:
            pretrained (bool): If True, loads pre-trained ImageNet weights.
        """
        super(DenseNet121TB, self).__init__()
        
        # Load the base DenseNet-121 model
        if hasattr(models, 'DenseNet121_Weights'):
            weights = models.DenseNet121_Weights.DEFAULT if pretrained else None
            self.features = models.densenet121(weights=weights).features
        else:
            # Fallback for older torchvision versions
            self.features = models.densenet121(pretrained=pretrained).features
            
        # Add global pooling and a classifier head
        # DenseNet-121 features output has 1024 channels
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.classifier = nn.Linear(1024, 2)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass of the model.
        
        Args:
            x (torch.Tensor): Input image tensor of shape (batch_size, 3, 224, 224)
            
        Returns:
            torch.Tensor: Logits of shape (batch_size, 2)
        """
        features = self.features(x)
        # Apply ReLU to features as per DenseNet design before classification
        out = nn.functional.relu(features, inplace=True)
        out = self.pool(out)
        out = torch.flatten(out, 1)
        out = self.classifier(out)
        return out
