import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.services.image_service import preprocess_image, load_image_as_pil
from backend.services.model_service import ModelService
from backend.services.gradcam_service import generate_gradcam_images

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SmartTB-Backend")

app = FastAPI(
    title="SmartTB Screen API",
    description="Backend API for early tuberculosis screening using chest X-rays and DenseNet-121.",
    version="1.0.0"
)

# Configure CORS for Frontend connectivity
# Allows local Next.js frontend (running on port 3000 or similar) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to specific frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model service instance
model_service = None

@app.on_event("startup")
def startup_event():
    """FastAPI startup handler to pre-load the model into memory."""
    global model_service
    logger.info("Initializing Model Service and loading weights...")
    try:
        model_service = ModelService()
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model weights: {str(e)}")
        logger.warning("Backend starting without model. Ensure best_model.pth is generated.")

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint to verify backend status and model loading."""
    return {
        "status": "healthy",
        "model_loaded": model_service is not None and model_service.model is not None
    }

@app.post("/api/predict")
async def predict_tb(file: UploadFile = File(...)):
    """
    Accepts an uploaded chest X-ray image, performs preprocessing,
    runs DenseNet-121 binary prediction, and generates Grad-CAM visualizations.
    
    Args:
        file (UploadFile): The uploaded chest X-ray image.
        
    Returns:
        dict: Analysis results containing prediction label, confidence scores,
              and base64-encoded visualization images (original, heatmap, overlay).
    """
    global model_service
    if model_service is None or model_service.model is None:
        # Lazy initialization fallback if startup loading failed
        try:
            model_service = ModelService()
        except Exception as e:
            logger.error(f"Model service uninitialized: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML model is currently unavailable on the server."
            )

    # Validate file content type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: '{file.content_type}'. Please upload an image file."
        )
        
    try:
        # Read file bytes
        image_bytes = await file.read()
        
        # Load image as PIL for Grad-CAM overlay generation
        original_pil = load_image_as_pil(image_bytes)
        
        # Preprocess image into tensor: shape (1, 3, 224, 224)
        input_tensor = preprocess_image(image_bytes)
        
    except ValueError as val_err:
        logger.error(f"Image preprocessing failed: {str(val_err)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to process image: {str(val_err)}. Ensure it is a valid chest X-ray."
        )
    except Exception as e:
        logger.error(f"Error reading upload file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while loading the uploaded file."
        )
        
    try:
        # Run inference
        prediction_result = model_service.predict(input_tensor)
        
        # Generate Grad-CAM explaining class index 1 (Positive)
        # This highlights regions of interest associated with TB signs
        b64_orig, b64_heat, b64_over = generate_gradcam_images(
            model=model_service.model,
            input_tensor=input_tensor,
            original_pil=original_pil,
            target_class_idx=1,
            alpha=0.45
        )
        
        logger.info(f"Successfully processed image. Prediction: {prediction_result['label']} (Confidence: {prediction_result['confidence']:.4f})")
        
        return {
            "success": True,
            "prediction": prediction_result["label"],
            "confidence": prediction_result["confidence"],
            "probabilities": prediction_result["probabilities"],
            "images": {
                "original": b64_orig,
                "heatmap": b64_heat,
                "overlay": b64_over
            }
        }
        
    except Exception as e:
        logger.error(f"Model inference or Grad-CAM generation failed: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline failure: {str(e)}"
        )
