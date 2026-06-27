import os
import sys

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from training.train import train_model

if __name__ == "__main__":
    # If run directly, read potential command-line parameters
    dataset_path = "dataset" if len(sys.argv) < 2 else sys.argv[1]
    epochs = 10 if len(sys.argv) < 3 else int(sys.argv[2])
    
    print(f"Starting DenseNet-121 training on dataset path '{dataset_path}' for {epochs} epochs...")
    train_model(data_dir=dataset_path, epochs=epochs, save_path="best_model.pth")
