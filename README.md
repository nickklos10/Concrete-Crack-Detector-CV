# Concrete Crack Detection Web App

A Flask-based web application to detect cracks in concrete using a pre-trained ResNet-18 model. The application allows users to upload images of concrete surfaces and utilizes a deep learning model to determine whether a crack is present with a high level of confidence.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Model Training Details](#model-training-details)

---

## Project Overview

This project provides a web-based interface for detecting cracks in concrete surfaces, leveraging a trained deep learning model built using ResNet-18. Users can upload images for real-time prediction, with results indicating the presence or absence of a crack and the confidence level of the prediction.

**Note:** The trained model file (`resnet18_trained.pth`) is not included in the GitHub repository due to its size. Please refer to the [Model Training Details](#model-training-details) section for instructions on training and saving the model.

## Technologies Used

- **Flask** - for creating the web application and handling HTTP requests
- **PyTorch** - for model development and training, utilizing the ResNet-18 architecture
- **Torchvision** - for image transformations and pre-trained model utilities
- **PIL (Pillow)** - for handling image uploads and conversions
- **HTML, CSS, JavaScript** - for building the user interface and handling client-side interactions
- **Axios** - for making HTTP requests from the frontend to the backend
- **Jinja2** - for template rendering in Flask

## Installation

1. **Clone the Repository:**
   ```
   git clone https://github.com/nickklos10/Concrete-Crack-Detector-CV.git
   cd Concrete-Crack-Detector-CV
   ```

2. **Install Dependencies:** Ensure you are using a Python virtual environment, then install the required packages:
   ```
   pip install -r requirements.txt
   ```
   
3. **Add the Pre-trained Model:**
   - Place the resnet18_trained.pth model file in the project directory. You may need to train the model yourself if it’s not provided due to size constraints (see Model         Training Details).

4. **Run the Application:**
   ```
   python app.py
   ```
The app should be accessible at http://localhost:8000.


## Usage

1. Open the web app in a browser by navigating to http://localhost:8000.
2. Drag and drop an image or click to upload a concrete surface image.
3. Wait for the model to process the image, and view the results with the crack detection status and confidence level.
   

## Model Training Details
The deep learning model is based on ResNet-18, a convolutional neural network architecture well-suited for image classification tasks.


## Training Script
The model was trained using a custom training script in PyTorch. Here’s an overview of the training process:

1. **Dataset Preparation:**

A labeled dataset of concrete images with and without cracks was used. Each image was resized to 227x227 pixels for compatibility with the ResNet-18 model.

2. **Data Transformations:**

Applied standard image transformations, including resizing, normalization with mean [0.485, 0.456, 0.406], and standard deviation [0.229, 0.224, 0.225].

3. **Model Architecture:**

ResNet-18 was used as the base architecture. The final fully connected layer was modified to output two classes: "Crack" and "No Crack."

4. **Training Parameters:**

Optimizer: `Adam`
Learning Rate: `0.001`
Loss Function: `CrossEntropyLoss`
Number of Epochs: `20`
Batch Size: `32`

5. **Saving the Model:**

- After training, the model was saved using torch.save:
```
torch.save(model.state_dict(), 'resnet18_trained.pth')
```

## Frontend Look of the Web-App

![Screenshot 2024-11-04 at 5 35 23 PM](https://github.com/user-attachments/assets/765ee6e2-79ed-4095-9bd0-c2ccc9cf95a0)


