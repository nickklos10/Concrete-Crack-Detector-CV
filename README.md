# Concrete Crack Detection Web Application

A full-stack web application for detecting cracks in concrete surfaces using AI-powered deep learning technology. The application features a Flask backend with a pre-trained ResNet-18 model and a modern React frontend built with Next.js, TypeScript, and Tailwind CSS.

![Concrete Crack Detector Interface](https://github.com/user-attachments/assets/765ee6e2-79ed-4095-9bd0-c2ccc9cf95a0)

## 🎯 Project Overview

This application provides a professional web-based interface for detecting cracks in concrete surfaces, leveraging a trained ResNet-18 deep learning model. Users can upload images through an intuitive drag-and-drop interface for real-time analysis, receiving detailed results with confidence scores and recommendations.

## ✨ Key Features

### 🎨 Modern UI/UX

- **Glass Morphism Effects**: Beautiful translucent components with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Progress**: Animated loading states with progress tracking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Professional gradient background with excellent contrast

### 🤖 AI-Powered Analysis

- **ResNet-18 Model**: Pre-trained deep learning architecture for high accuracy
- **Confidence Scoring**: Detailed probability breakdown for predictions
- **Fast Processing**: Optimized inference pipeline for quick results
- **Binary Classification**: Detects "Crack" vs "No Crack" with confidence levels

### 🔧 Technical Excellence

- **Full-Stack TypeScript**: Type safety throughout the application
- **Modern Architecture**: Clean separation between frontend and backend
- **Error Handling**: Comprehensive error states with helpful messages
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🚀 Technology Stack

### Backend

- **Flask** - Web framework for API endpoints
- **PyTorch** - Deep learning framework for model inference
- **Torchvision** - Image transformations and utilities
- **PIL (Pillow)** - Image processing and manipulation
- **ResNet-18** - Pre-trained convolutional neural network

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Beautiful icon library
- **React Dropzone** - File upload with drag & drop
- **Axios** - HTTP client for API communication

## 📦 Installation & Setup

### Quick Start (Recommended)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nickklos10/Concrete-Crack-Detector-CV.git
   cd Concrete-Crack-Detector-CV
   ```

2. **Automated Setup**

   ```bash
   ./setup.sh
   ```

   This script will:

   - Check for Node.js 18+ and Python 3+
   - Install all dependencies (frontend & backend)
   - Create environment configuration
   - Validate setup requirements

3. **Add the Pre-trained Model**

   - Place the `resnet18_trained.pth` model file in the project root directory
   - The model file is required for the application to function

4. **Start Development Servers**
   ```bash
   ./start-dev.sh
   ```
   This will start both the Flask backend and Next.js frontend simultaneously.

### Manual Setup

If you prefer manual installation:

#### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

#### Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Usage

1. **Access the Application**

   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

2. **Upload Images**

   - Drag and drop concrete surface images
   - Or click to select files from your device
   - Supported formats: JPEG, JPG, PNG (up to 5MB)

3. **View Analysis**

   - Real-time progress tracking during analysis
   - Detailed results with confidence scores
   - Probability breakdown for crack detection
   - Recommendations for detected cracks

4. **Start Over**
   - Easy reset functionality to analyze new images
   - Clear upload area for additional analyses

## 🏗️ Project Structure

```
├── app.py                     # Flask backend server
├── requirements.txt           # Python dependencies
├── resnet18_trained.pth      # Pre-trained AI model
├── setup.sh                  # Automated setup script
├── start-dev.sh             # Development server launcher
├── package.json             # Node.js dependencies
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── src/                     # Frontend source code
    ├── app/                 # Next.js App Router
    │   ├── globals.css      # Global styles
    │   ├── layout.tsx       # Root layout
    │   └── page.tsx         # Main application page
    ├── components/          # React components
    │   ├── ui/             # Reusable UI components
    │   ├── AnalysisResults.tsx
    │   ├── ImageUploader.tsx
    │   └── LoadingSpinner.tsx
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utility functions
    └── types/              # TypeScript definitions
```

## 🤖 AI Model Details

### Architecture

- **Base Model**: ResNet-18 convolutional neural network
- **Input Size**: 227x227 pixels
- **Classes**: Binary classification (Crack / No Crack)
- **Optimization**: Dynamic quantization for faster inference

### Training Parameters

- **Optimizer**: Adam
- **Learning Rate**: 0.001
- **Loss Function**: CrossEntropyLoss
- **Epochs**: 20
- **Batch Size**: 32

### Data Processing

- **Normalization**: Mean [0.485, 0.456, 0.406], Std [0.229, 0.224, 0.225]
- **Transformations**: Resize, tensor conversion, normalization
- **Preprocessing**: Automatic image validation and format conversion

## 🔌 API Documentation

### Prediction Endpoint

```http
POST /predict
Content-Type: multipart/form-data

Body:
{
  "image": File
}

Response:
{
  "prediction": "Crack" | "No Crack",
  "confidence": number,
  "probabilities": {
    "crack": number,
    "no_crack": number
  }
}
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

Common error scenarios:

- No image provided
- Invalid file format
- File size exceeds limit
- Model inference errors

## 🎨 Design System

### Color Palette

- **Primary**: Blue tones for actions and highlights
- **Success**: Green for successful detections
- **Error/Crack**: Red for crack detection alerts
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Primary Font**: Inter (optimized for readability)
- **Monospace Font**: JetBrains Mono (for technical content)

### Responsive Breakpoints

- **Mobile**: < 640px (touch-optimized)
- **Tablet**: 640px - 1024px (balanced layout)
- **Desktop**: > 1024px (full feature set)

## 🧪 Development & Testing

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build Verification

```bash
npm run build
```

### Model Validation

The application includes automatic validation for:

- Model file existence
- File format compatibility
- Image size constraints
- Network connectivity

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Backend Deployment

The Flask backend can be deployed to various platforms:

- **Heroku**: Simple deployment with Procfile
- **AWS**: EC2 or Lambda deployment
- **Docker**: Containerized deployment

### Environment Variables

Create `.env.local` for frontend configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

## 📈 Performance Optimizations

### Frontend

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Built-in Next.js optimization
- **Bundle Analysis**: Optimized build output
- **Lazy Loading**: Components loaded on demand

### Backend

- **Model Quantization**: Dynamic quantization for faster inference
- **Request Optimization**: Efficient image processing pipeline
- **Error Caching**: Reduced redundant processing
- **Memory Management**: Optimized model loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Test your changes thoroughly
5. Commit using conventional commits (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is part of the Concrete Crack Detector application. See the repository license for details.

## 🆘 Troubleshooting

### Common Issues

**Model file not found:**

- Ensure `resnet18_trained.pth` is in the project root directory
- Check file permissions and accessibility

**Dependencies not installing:**

- Verify Node.js 18+ and Python 3+ are installed
- Try deleting `node_modules` and running `npm install` again
- Use `pip install --upgrade pip` before installing Python packages

**Frontend not connecting to backend:**

- Ensure both servers are running on correct ports
- Check firewall settings
- Verify API proxy configuration in `next.config.js`

**Images not uploading:**

- Check file size (must be < 5MB)
- Verify file format (JPEG, JPG, PNG only)
- Ensure proper file permissions

For additional support, please open an issue on the GitHub repository.

---
