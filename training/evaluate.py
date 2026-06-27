import os
import sys
import torch
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.densenet import DenseNet121TB
from training.datasets import ChestXRayDataset

def evaluate_model(data_dir: str = "dataset", model_path: str = "best_model.pth", batch_size: int = 16):
    """
    Evaluates the trained DenseNet121TB model on a test set.
    
    Args:
        data_dir (str): Root dataset folder containing the 'test' subdirectory.
        model_path (str): File path to the trained model checkpoint.
        batch_size (int): Evaluation batch size.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Evaluating using device: {device}")
    
    test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    test_dataset = ChestXRayDataset(os.path.join(data_dir, "test"), transform=test_transform)
    
    if len(test_dataset) == 0:
        print("Warning: Test dataset is empty! Please verify the folder structure.")
        return
        
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    
    # Load Model
    model = DenseNet121TB(pretrained=False)
    if not os.path.exists(model_path):
        print(f"Error: Model checkpoint not found at {model_path}")
        return
        
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    
    all_preds = []
    all_labels = []
    
    print("Running evaluation loop...")
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_preds)
    conf_matrix = confusion_matrix(all_labels, all_preds)
    class_report = classification_report(
        all_labels, 
        all_preds, 
        target_names=["Negative (Normal)", "Positive (Tuberculosis)"]
    )
    
    print("\n" + "="*40)
    print("           EVALUATION RESULTS           ")
    print("="*40)
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("\nConfusion Matrix:")
    print(conf_matrix)
    print("\nDetailed Classification Report:")
    print(class_report)
    print("="*40)

if __name__ == "__main__":
    dataset_path = "dataset" if len(sys.argv) < 2 else sys.argv[1]
    best_model = "best_model.pth" if len(sys.argv) < 3 else sys.argv[2]
    evaluate_model(data_dir=dataset_path, model_path=best_model)
