import os
from PIL import Image
from torch.utils.data import Dataset

class ChestXRayDataset(Dataset):
    """
    Custom PyTorch Dataset for Chest X-Ray Tuberculosis classification.
    Assumes standard class folder structure:
        data_dir/NORMAL/img1.png -> label 0 (Negative)
        data_dir/TUBERCULOSIS/img2.png -> label 1 (Positive)
    """
    def __init__(self, data_dir: str, transform=None):
        """
        Initializes the dataset.
        
        Args:
            data_dir (str): Path to the dataset subdirectory (e.g. 'train', 'val', 'test').
            transform (callable, optional): PyTorch transforms to apply to the images.
        """
        self.data_dir = data_dir
        self.transform = transform
        self.image_paths = []
        self.labels = []
        
        # Label mappings: 0 for Normal (Negative), 1 for Tuberculosis (Positive)
        self.class_to_idx = {"NORMAL": 0, "TUBERCULOSIS": 1}
        
        # Read files and verify path existence
        if os.path.exists(data_dir):
            for class_name, label_idx in self.class_to_idx.items():
                class_path = os.path.join(data_dir, class_name)
                if not os.path.isdir(class_path):
                    continue
                    
                for filename in os.listdir(class_path):
                    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                        self.image_paths.append(os.path.join(class_path, filename))
                        self.labels.append(label_idx)
                        
    def __len__(self) -> int:
        """Returns the total number of images in the dataset."""
        return len(self.image_paths)
        
    def __getitem__(self, idx: int) -> tuple:
        """
        Gets the image and label at a specific index.
        
        Args:
            idx (int): Dataset index.
            
        Returns:
            tuple: (transformed_image_tensor, label_int)
        """
        img_path = self.image_paths[idx]
        # Open in RGB to standardise grayscale and colored inputs
        image = Image.open(img_path).convert("RGB")
        label = self.labels[idx]
        
        if self.transform:
            image = self.transform(image)
            
        return image, label
