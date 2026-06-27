import os
import sys

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.image_service import preprocess_image
from backend.services.model_service import ModelService

def run_command_line_inference():
    """
    Runs command-line inference on a local chest X-ray image file.
    Usage:
        python predict.py <path_to_xray_image> [model_path]
    """
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_xray_image> [model_path]")
        sys.exit(1)
        
    image_path = sys.argv[1]
    model_path = sys.argv[2] if len(sys.argv) > 2 else "best_model.pth"
    
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at '{image_path}'")
        sys.exit(1)
        
    try:
        # Load and verify model path
        if not os.path.exists(model_path):
            print(f"Error: Model checkpoint not found at '{model_path}'. Ensure the dummy model is generated first.")
            sys.exit(1)
            
        print(f"Loading DenseNet-121 model from '{model_path}'...")
        service = ModelService(model_path=model_path)
        
        # Load image bytes
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
            
        # Preprocess and predict
        print("Processing chest X-ray and running prediction...")
        input_tensor = preprocess_image(image_bytes)
        result = service.predict(input_tensor)
        
        # Output details
        print("\n" + "="*45)
        print("             DIAGNOSTIC PREDICTION            ")
        print("="*45)
        print(f"File Path:  {image_path}")
        print(f"Result:     {result['label']}")
        print(f"Confidence: {result['confidence'] * 100:.2f}%")
        print("-"*45)
        print("Probabilities:")
        print(f"  Negative (Normal): {result['probabilities']['Negative'] * 100:.2f}%")
        print(f"  Positive (TB):     {result['probabilities']['Positive'] * 100:.2f}%")
        print("="*45 + "\n")
        
    except Exception as e:
        print(f"Prediction failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_command_line_inference()
