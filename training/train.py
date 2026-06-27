import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
import matplotlib.pyplot as plt

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.densenet import DenseNet121TB
from training.datasets import ChestXRayDataset

def train_model(
    data_dir: str = "dataset", 
    epochs: int = 10, 
    batch_size: int = 16, 
    lr: float = 1e-4, 
    save_path: str = "best_model.pth"
):
    """
    Trains the DenseNet121TB model on Chest X-ray images.
    
    Args:
        data_dir (str): Root dataset folder containing 'train' and 'val' subdirectories.
        epochs (int): Number of training epochs.
        batch_size (int): Batch size.
        lr (float): Learning rate for Optimizer.
        save_path (str): Destination file path for best weights.
    """
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on device: {device}")
    
    # Data Augmentation & Normalisation for Training
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Just Normalisation for Validation
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Datasets
    train_dataset = ChestXRayDataset(os.path.join(data_dir, "train"), transform=train_transform)
    val_dataset = ChestXRayDataset(os.path.join(data_dir, "val"), transform=val_transform)
    
    if len(train_dataset) == 0:
        print("Warning: Train dataset is empty! Please verify the folder structure.")
        return
        
    # Data Loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    
    # Model Setup
    model = DenseNet121TB(pretrained=True).to(device)
    
    # Loss & Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.1, patience=3)
    
    best_val_loss = float('inf')
    
    # Tracking curves
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0
        
        # Epoch Train Pass
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)
            
        epoch_train_loss = running_loss / len(train_dataset)
        epoch_train_acc = correct_train / total_train
        
        # Epoch Validation Pass
        model.eval()
        running_val_loss = 0.0
        correct_val = 0
        total_val = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                running_val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == labels.data).item()
                total_val += labels.size(0)
                
        epoch_val_loss = running_val_loss / len(val_dataset) if len(val_dataset) > 0 else 0.0
        epoch_val_acc = correct_val / total_val if total_val > 0 else 0.0
        
        scheduler.step(epoch_val_loss)
        
        history['train_loss'].append(epoch_train_loss)
        history['train_acc'].append(epoch_train_acc)
        history['val_loss'].append(epoch_val_loss)
        history['val_acc'].append(epoch_val_acc)
        
        print(f"Epoch {epoch+1}/{epochs} | "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f} | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")
              
        # Save best model checkpoint
        if epoch_val_loss < best_val_loss and len(val_dataset) > 0:
            best_val_loss = epoch_val_loss
            torch.save(model.state_dict(), save_path)
            print(f"--> Saved best model weights to {save_path}")
            
    # If no validation set was provided, save the last epoch
    if len(val_dataset) == 0:
        torch.save(model.state_dict(), save_path)
        print(f"--> Saved final model weights to {save_path}")
        
    # Plot performance curves
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history['train_loss'], label='Train Loss')
    plt.plot(history['val_loss'], label='Val Loss')
    plt.title('Loss Curves')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history['train_acc'], label='Train Acc')
    plt.plot(history['val_acc'], label='Val Acc')
    plt.title('Accuracy Curves')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.savefig('training_curves.png')
    plt.close()
    print("Performance curves saved as 'training_curves.png'")

if __name__ == "__main__":
    # Configure command-line execution parameters
    dataset_path = "dataset" if len(sys.argv) < 2 else sys.argv[1]
    epochs_val = 10 if len(sys.argv) < 3 else int(sys.argv[2])
    train_model(data_dir=dataset_path, epochs=epochs_val)
