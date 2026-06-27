import os
import sys

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from training.evaluate import evaluate_model

if __name__ == "__main__":
    dataset_path = "dataset" if len(sys.argv) < 2 else sys.argv[1]
    best_model = "best_model.pth" if len(sys.argv) < 3 else sys.argv[2]
    
    print(f"Evaluating model '{best_model}' on dataset '{dataset_path}'...")
    evaluate_model(data_dir=dataset_path, model_path=best_model)
