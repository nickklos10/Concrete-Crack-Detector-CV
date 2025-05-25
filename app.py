from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import logging
import time
import traceback
import tempfile
import os
from typing import Dict, Any
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Concrete Crack Detector API",
    description="API for detecting cracks in concrete images using deep learning",
    version="1.0.0"
)

# Enable CORS for React frontend with production origins
allowed_origins = [
    "http://localhost:3000",  # Local development
    "https://localhost:3000",
    # Add specific Vercel deployment URLs as needed
    # "https://your-app-name.vercel.app",
]

# Add custom domain if provided
custom_origin = os.getenv("FRONTEND_URL")
if custom_origin:
    allowed_origins.append(custom_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

def get_s3_client():
    """Create S3 client with credentials from environment variables"""
    return boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION', 'us-east-2')
    )

class CrackDetector:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        self.model = None
        self.transform = self._get_transforms()

    def _download_model_from_s3(self):
        """Download model from S3 bucket"""
        try:
            logger.info("Downloading model from S3...")
            s3_client = get_s3_client()
            bucket_name = os.getenv('S3_BUCKET_NAME')
            model_key = os.getenv('S3_MODEL_KEY', 'resnet18_trained.pth')
            
            if not bucket_name:
                raise ValueError("S3_BUCKET_NAME environment variable not set")
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pth') as temp_file:
                s3_client.download_fileobj(bucket_name, model_key, temp_file)
                temp_file_path = temp_file.name
            
            logger.info("Model downloaded successfully from S3")
            return temp_file_path
            
        except ClientError as e:
            logger.error(f"S3 error: {str(e)}")
            raise Exception(f"Failed to download model from S3: {str(e)}")
        except Exception as e:
            logger.error(f"Error downloading model: {str(e)}")
            raise

    def _load_model(self):
        """Load model from S3 or local fallback"""
        try:
            # In production, we must use S3 (no local fallback)
            model_path = self._download_model_from_s3()

            model = models.resnet18(weights=None)  # No pre-trained weights
            for param in model.parameters():
                param.requires_grad = False  # Freeze all layers
            
            # Replace the final fully connected layer to match the number of classes
            model.fc = torch.nn.Linear(512, 2)
            
            # Load trained weights
            state_dict = torch.load(model_path, map_location=self.device)
            model.load_state_dict(state_dict)
            
            # Clean up temporary file
            if os.path.exists(model_path):
                os.unlink(model_path)
            
            # Skip quantization for compatibility with newer PyTorch versions
            model = model.to(self.device)
            model.eval()
            
            logger.info("Model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise HTTPException(
                status_code=503, 
                detail="Model loading failed. Please check S3 configuration and try again."
            )

    def _get_transforms(self):
        return transforms.Compose([
            transforms.Resize((227, 227)),  # Ensure consistent size
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def _ensure_model_loaded(self):
        """Lazy load the model when first needed"""
        if self.model is None:
            self.model = self._load_model()
        return self.model
    
    def predict(self, image_bytes: bytes) -> Dict[str, Any]:
        try:
            start_time = time.time()

            # Ensure model is loaded (lazy loading)
            model = self._ensure_model_loaded()

            # Open image from bytes
            try:
                logger.debug(f"First 100 bytes of uploaded image: {image_bytes[:100]}")
                image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
                logger.info(f"Image opened in {time.time() - start_time:.2f}s")
            except Exception as e:
                logger.error(f"Error opening image: {str(e)}")
                raise

            # Resize the image
            try:
                image = image.resize((227, 227))
                logger.info(f"Image resized in {time.time() - start_time:.2f}s")
            except Exception as e:
                logger.error(f"Error resizing image: {str(e)}")
                raise

            # Transform image
            try:
                image_tensor = self.transform(image).unsqueeze(0).to(self.device)
                logger.info(f"Image transformed in {time.time() - start_time:.2f}s")
            except Exception as e:
                logger.error(f"Error transforming image: {str(e)}")
                raise

            # Get prediction
            try:
                with torch.no_grad():
                    outputs = model(image_tensor)
                    probabilities = torch.nn.functional.softmax(outputs, dim=1)
                    confidence, prediction = torch.max(probabilities, 1)
                logger.info(f"Inference completed in {time.time() - start_time:.2f}s")

                return {
                    'prediction': 'Crack' if prediction.item() == 1 else 'No Crack',
                    'confidence': float(confidence.item()),
                    'probabilities': {
                        'crack': float(probabilities[0][1]),
                        'no_crack': float(probabilities[0][0])
                    }
                }
            except Exception as e:
                logger.error(f"Error during inference: {str(e)}")
                raise
        except Exception as e:
            logger.error(f"Unexpected error in prediction: {str(e)}")
            raise


# Initialize detector (model will be loaded on first use)
detector = CrackDetector()


@app.post("/predict")
async def predict_crack(image: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict whether an uploaded image contains concrete cracks.
    
    Args:
        image: The image file to analyze (PNG, JPG, JPEG)
        
    Returns:
        Dict containing prediction, confidence, and probabilities
        
    Raises:
        HTTPException: If there's an error processing the image
    """
    try:
        # Check file format
        if not image.filename:
            raise HTTPException(status_code=400, detail="No image selected")
            
        if not image.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file format. Please upload a PNG or JPG image."
            )
        
        # Check file size (5MB limit)
        image_bytes = await image.read()
        if len(image_bytes) > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(
                status_code=413, 
                detail="File too large. Maximum size is 5MB."
            )
        
        # Get prediction
        result = detector.predict(image_bytes)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.error(traceback.format_exc())  # Log the full traceback for debugging
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
@app.head("/")  # Support HEAD requests for health checks
async def root():
    """Health check endpoint"""
    return {"message": "Concrete Crack Detector API is running"}


@app.get("/health")
@app.head("/health")  # Support HEAD requests for health checks
async def health():
    """Health check endpoint with model status"""
    return {
        "status": "healthy",
        "model_loaded": detector.model is not None,
        "device": str(detector.device)
    }


if __name__ == '__main__':
    import uvicorn
    import os
    
    # Use PORT environment variable from Render.com, fallback to 8000 for local dev
    port = int(os.getenv('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
