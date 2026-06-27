import os
import sys

# Ensure root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.gradcam_service import GradCAM, generate_gradcam_images

# Export for external module loading
__all__ = ["GradCAM", "generate_gradcam_images"]
