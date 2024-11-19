from flask import Flask, render_template, request, jsonify
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # Limit upload size to 5 MB


class CrackDetector:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        self.model = self._load_model()
        self.transform = self._get_transforms()
        
    def _load_model(self):
        try:
            model = models.resnet18(weights=None)  # No pre-trained weights
            for param in model.parameters():
                param.requires_grad = False  # Freeze all layers
            
            # Replace the final fully connected layer to match the number of classes
            model.fc = torch.nn.Linear(512, 2)
            
            # Load trained weights
            state_dict = torch.load('resnet18_trained.pth', map_location=self.device)
            model.load_state_dict(state_dict)
            
            # Apply dynamic quantization for faster inference
            model = torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)

            model = model.to(self.device)
            model.eval()
            
            logger.info("Model loaded successfully")
            return model
        except FileNotFoundError:
            logger.error("Model file 'resnet18_trained.pth' not found. Ensure it is in the correct directory.")
            raise
        except RuntimeError as e:
            logger.error(f"Error loading model state_dict: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error loading model: {str(e)}")
            raise

    def _get_transforms(self):
        return transforms.Compose([
            transforms.Resize((227, 227)),  # Ensure consistent size
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def predict(self, image_bytes):
        try:
            start_time = time.time()

            # Open image from bytes
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            logger.info(f"Image opened in {time.time() - start_time:.2f}s")

            # Resize the image early to reduce overhead
            image = image.resize((227, 227))
            logger.info(f"Image resized in {time.time() - start_time:.2f}s")

            # Transform image
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            logger.info(f"Image transformed in {time.time() - start_time:.2f}s")

            # Get prediction
            with torch.no_grad():
                outputs = self.model(image_tensor)
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
            logger.error(f"Error during prediction: {str(e)}")
            raise


# Initialize detector
detector = CrackDetector()


@app.route('/')
def home():
    return render_template('index.html')  


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
            
        # Read image
        image_bytes = image_file.read()
        
        # Get prediction
        result = detector.predict(image_bytes)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False, port=8000)
