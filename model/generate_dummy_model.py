import os
import sys
import torch

# Ensure the root project path is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.densenet import DenseNet121TB

def generate_dummy_model():
    """
    Generates a dummy trained DenseNet121TB model and saves its state_dict to best_model.pth.
    This allows the backend server to boot up and run inference out-of-the-box.
    """
    print("Initializing DenseNet121TB model...")
    # Initialize the model with randomized weights (no pretrained weights to speed up initialization)
    model = DenseNet121TB(pretrained=False)
    
    # Set the destination path to the project root directory as requested
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(project_root, 'best_model.pth')
    
    print(f"Saving model state dict to {output_path}...")
    torch.save(model.state_dict(), output_path)
    print("Dummy model generated successfully!")

if __name__ == "__main__":
    generate_dummy_model()
