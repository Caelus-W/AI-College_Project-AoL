# SmartTB Screen

SmartTB Screen is a production-grade medical decision support system powered by deep learning for early-stage Tuberculosis screening using Chest X-Ray (CXR) radiographs.

The platform integrates a fine-tuned **DenseNet-121** model (via transfer learning) with **Grad-CAM (Gradient-weighted Class Activation Mapping)** to classify X-rays (Tuberculosis Positive / Negative) and provide visual heatmaps localizing critical diagnostic features for radiologists.

---

## Key Features

- **Deep Transfer Learning**: Utilizes DenseNet-121 features fine-tuned for high sensitivity chest radiography triage.
- **Explainable AI (XAI)**: Registers gradients and activations on the last features layer (`norm5`) to render high-contrast heatmaps showing visual diagnostic triggers.
- **Dynamic Image Cross-Fader**: Enables clinicians to slide between the raw X-ray and the Grad-CAM activation map dynamically in their browser.
- **Clinical Logging & History**: Archives recent diagnostic runs locally within the browser (`localStorage`) for easy retrieval and tracking.
- **Dark Mode Support**: Deep dashboard design optimized for low-light radiology reading rooms.
- **API Status Monitor**: Real-time polling from the frontend to show model node connectivity.

---

## Project Structure

```text
AI-College_Project-AoL/
│
├── backend/                  # FastAPI Application
│   ├── services/             # Modular Diagnostic Services
│   │   ├── image_service.py  # Image loading and 224x224 normalization
│   │   ├── model_service.py  # Model loading (best_model.pth) & inference
│   │   └── gradcam_service.py# Hook registration & heatmap generation
│   └── main.py               # REST API endpoints (CORS, file upload, predict)
│
├── frontend/                 # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (pages & styles)
│   │   └── components/       # UI (Navbar, Hero, Uploader, ResultsView, History)
│   └── package.json
│
├── model/                    # ML Model Definitions & Init Scripts
│   ├── densenet.py           # Custom DenseNet121TB architecture
│   └── generate_dummy_model.py # Script to instantiate default model weights
│
├── training/                 # Model Training & Testing Pipeline
│   ├── datasets.py           # Custom ChestXRayDataset class
│   ├── train.py              # Transfer learning training epochs with data aug
│   └── evaluate.py           # Diagnostic evaluation metrics (Acc, F1, Conf Matrix)
│
├── best_model.pth            # Trained weights file (required by backend)
├── app.py                    # Root entrypoint to run FastAPI server (Uvicorn)
├── predict.py                # Command-line prediction script
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## Setup & Running Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Python 3.10+** (Anaconda recommended)
- **Node.js 18+** & `npm`

---

### 2. Backend Setup
1. **Initialize the Virtual Environment**:
   ```bash
   python -m venv venv
   ```
2. **Activate the Environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
3. **Install Dependencies**:
   (Installs PyTorch CPU version to optimize disk footprint and download speed for server-side inference)
   ```bash
   pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
   ```
4. **Generate Initial Model Weights**:
   Creates a default weight checkpoint for testing:
   ```bash
   python model/generate_dummy_model.py
   ```

---

### 3. Launching the Backend Server
Start the FastAPI server from the project root:
```bash
python app.py
```
- The backend will start on: **`http://127.0.0.1:8000`**
- Interactive Swagger API docs are available at: **`http://127.0.0.1:8000/docs`**

---

### 4. Frontend Setup & Run
Open a new terminal window:
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install Node Packages**:
   ```bash
   npm install
   ```
3. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
- The web app will launch on: **`http://localhost:3000`**

---

## CLI Tools

### Single Image CLI Prediction
Evaluate local images directly from your terminal:
```bash
python predict.py <path_to_xray_image> [model_path]
```

### Model Training Pipeline
To retrain or fine-tune the model, structure your data folder as:
`dataset/{train,val,test}/{NORMAL,TUBERCULOSIS}/`
Then execute:
```bash
python train.py [dataset_directory] [number_of_epochs]
```
Performance curves will be saved as `training_curves.png`.

---

## Disclaimer
SmartTB Screen is a computer-aided screening tool designed for educational research and diagnostic decision support. It does NOT replace professional medical examinations, laboratory testing, or microbiological assessments.
