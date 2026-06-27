import io
import base64
from PIL import Image

def image_to_base64(image: Image.Image, format_type: str = "JPEG") -> str:
    """
    Converts a PIL Image into a base64 encoded string with standard MIME header.
    
    Args:
        image (Image.Image): PIL Image object.
        format_type (str): Output format ("JPEG" or "PNG").
        
    Returns:
        str: Base64 data URL.
    """
    buffered = io.BytesIO()
    image.save(buffered, format=format_type)
    b64_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/{format_type.lower()};base64,{b64_str}"

def is_valid_image(file_bytes: bytes) -> bool:
    """
    Checks if raw bytes can be parsed as a valid image by PIL.
    
    Args:
        file_bytes (bytes): Raw binary bytes.
        
    Returns:
        bool: True if valid, False otherwise.
    """
    try:
        Image.open(io.BytesIO(file_bytes)).verify()
        return True
    except Exception:
        return False
