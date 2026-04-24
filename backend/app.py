import os
import json
import torch
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import base64
from datetime import datetime
import sqlite3
from torchvision import models, transforms
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "measles_detection.db")

def choose_existing_path(candidates):
    """Pick the first existing path; otherwise keep the first candidate as default."""
    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return candidates[0]

DEFAULT_MODEL_PATH = choose_existing_path([
    os.path.abspath(os.path.join(BASE_DIR, "models", "measles_best_model_trained.pt")),
    os.path.abspath(os.path.join(BASE_DIR, "..", "measles_binary", "checkpoints", "measles_best_model_trained.pt")),
    os.path.abspath(os.path.join(BASE_DIR, "..", "..", "measles_binary", "checkpoints", "measles_best_model_trained.pt"))
])
DEFAULT_CLASS_IDX_PATH = choose_existing_path([
    os.path.abspath(os.path.join(BASE_DIR, "models", "class_to_idx.json")),
    os.path.abspath(os.path.join(BASE_DIR, "..", "measles_binary", "checkpoints", "class_to_idx.json")),
    os.path.abspath(os.path.join(BASE_DIR, "..", "..", "measles_binary", "checkpoints", "class_to_idx.json"))
])
MODEL_PATH = os.getenv("MODEL_PATH", DEFAULT_MODEL_PATH)
CLASS_IDX_PATH = os.getenv("CLASS_IDX_PATH", DEFAULT_CLASS_IDX_PATH)
DECISION_THRESHOLD = 0.26

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

class_to_idx = {}
idx_to_class = {}
model = None
model_load_error = None

def initialize_model():
    """Load class mapping and model once; keep server alive if files are unavailable."""
    global class_to_idx, idx_to_class, model, model_load_error

    if model is not None:
        return True

    try:
        with open(CLASS_IDX_PATH, "r", encoding="utf-8") as f:
            class_to_idx = json.load(f)

        if not class_to_idx:
            raise ValueError("Class mapping file is empty")

        idx_to_class = {v: k for k, v in class_to_idx.items()}

        loaded_model = models.resnet18(weights=None)
        loaded_model.fc = torch.nn.Linear(512, len(class_to_idx))

        checkpoint = torch.load(MODEL_PATH, map_location=device)
        # Support both raw state_dict checkpoints and training checkpoint dicts.
        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
        else:
            state_dict = checkpoint

        loaded_model.load_state_dict(state_dict)
        loaded_model.to(device)
        loaded_model.eval()
        model = loaded_model
        model_load_error = None
        logger.info("Model loaded successfully")
        return True
    except Exception as exc:
        model = None
        model_load_error = str(exc)
        logger.warning("Model not loaded. Prediction endpoint will be unavailable: %s", exc)
        return False

def get_db_connection():
    """Create SQLite connection configured for restricted filesystem environments."""
    conn = sqlite3.connect(f"file:{DATABASE_PATH}?mode=rwc", uri=True, timeout=30)
    conn.execute("PRAGMA journal_mode=MEMORY")
    conn.execute("PRAGMA temp_store=MEMORY")
    return conn

# Initialize database
def init_db():
    """Initialize SQLite database"""
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            prediction TEXT,
            confidence REAL,
            symptoms TEXT,
            patient_age INTEGER,
            patient_gender TEXT,
            result TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()
initialize_model()

# Measles symptoms database
MEASLES_SYMPTOMS = {
    "fever": {
        "description": "High fever (101-104°F or higher)",
        "duration": "Usually appears first"
    },
    "cough": {
        "description": "Dry cough",
        "duration": "Often present"
    },
    "runny_nose": {
        "description": "Runny or stuffy nose",
        "duration": "Common symptom"
    },
    "sore_throat": {
        "description": "Sore throat",
        "duration": "May be present"
    },
    "red_eyes": {
        "description": "Red, watery, light-sensitive eyes",
        "duration": "Characteristic symptom"
    },
    "koplik_spots": {
        "description": "Koplik spots (white spots on mouth)",
        "duration": "Appears 2-3 days before rash"
    },
    "rash": {
        "description": "Red rash starting on face/hairline",
        "duration": "Appears 3-4 days after fever"
    },
    "body_aches": {
        "description": "Body aches and malaise",
        "duration": "Often present"
    },
    "fatigue": {
        "description": "Extreme fatigue and weakness",
        "duration": "Common throughout illness"
    },
    "loss_of_appetite": {
        "description": "Loss of appetite",
        "duration": "May be present"
    }
}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "device": str(device),
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "class_idx_path": CLASS_IDX_PATH,
        "model_load_error": model_load_error
    }), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint for quick service verification."""
    return jsonify({
        "message": "Measles detection backend is running.",
        "health_endpoint": "/health",
        "api_base": "/api"
    }), 200

@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of measles symptoms for frontend"""
    return jsonify({
        "symptoms": MEASLES_SYMPTOMS,
        "total_symptoms": len(MEASLES_SYMPTOMS)
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict measles from image and symptoms
    Expected request format:
    {
        "image": "base64_encoded_image",
        "symptoms": ["fever", "rash", ...],
        "patient_age": 25,
        "patient_gender": "M",
        "additional_notes": "optional notes"
    }
    """
    try:
        if not initialize_model():
            return jsonify({
                "error": "Model is not available on this deployment.",
                "details": model_load_error
            }), 503

        data = request.json
        
        # Validate request
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode and process image
        image_data = base64.b64decode(data['image'])
        image = Image.open(BytesIO(image_data)).convert('RGB')
        
        # Apply transforms
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            output = model(image_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
            
            confidence = confidence.item()
            predicted_idx = predicted_idx.item()
            predicted_class = idx_to_class.get(predicted_idx, "not_measles")
        
        # Apply decision threshold
        if predicted_class == "measles" and confidence < DECISION_THRESHOLD:
            predicted_class = "not_measles"
        
        # Get symptoms information
        symptoms = data.get('symptoms', [])
        symptom_score = len(symptoms) / len(MEASLES_SYMPTOMS)
        
        # Combined analysis
        model_confidence = confidence
        symptom_weight = 0.3
        model_weight = 0.7
        
        final_confidence = (model_weight * confidence + 
                           symptom_weight * symptom_score)
        
        # Determine final diagnosis
        final_prediction = "measles" if (predicted_class == "measles" and 
                                         final_confidence > DECISION_THRESHOLD) else "not_measles"
        
        # Store prediction in database
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            INSERT INTO predictions 
            (prediction, confidence, symptoms, patient_age, patient_gender, result)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            predicted_class,
            final_confidence,
            json.dumps(symptoms),
            data.get('patient_age'),
            data.get('patient_gender'),
            final_prediction
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True,
            "model_prediction": predicted_class,
            "model_confidence": float(model_confidence),
            "symptoms_provided": symptoms,
            "symptom_count": len(symptoms),
            "final_prediction": final_prediction,
            "final_confidence": float(final_confidence),
            "recommendation": get_recommendation(final_prediction, final_confidence, symptoms),
            "risk_level": get_risk_level(final_prediction, final_confidence, len(symptoms))
        }), 200
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/results', methods=['GET'])
def get_results():
    """Get all prediction results"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT 100')
        
        columns = ['id', 'timestamp', 'prediction', 'confidence', 'symptoms', 'patient_age', 'patient_gender', 'result']
        results = []
        for row in c.fetchall():
            results.append(dict(zip(columns, row)))
        
        conn.close()
        return jsonify({"results": results, "total": len(results)}), 200
        
    except Exception as e:
        logger.error(f"Error fetching results: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get prediction statistics"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Total predictions
        c.execute('SELECT COUNT(*) FROM predictions')
        total = c.fetchone()[0]
        
        # Measles cases
        c.execute('SELECT COUNT(*) FROM predictions WHERE result = "measles"')
        measles_cases = c.fetchone()[0]
        
        # Average confidence
        c.execute('SELECT AVG(confidence) FROM predictions')
        avg_confidence = c.fetchone()[0] or 0
        
        conn.close()
        
        return jsonify({
            "total_predictions": total,
            "measles_cases": measles_cases,
            "non_measles_cases": total - measles_cases,
            "measles_percentage": (measles_cases / total * 100) if total > 0 else 0,
            "average_confidence": float(avg_confidence)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({"error": str(e)}), 500

def get_recommendation(prediction, confidence, symptoms):
    """Get medical recommendation based on prediction"""
    if prediction == "measles":
        if confidence > 0.8:
            return {
                "level": "HIGH RISK",
                "recommendation": "Immediate medical consultation strongly recommended. Measles is highly contagious and requires medical intervention.",
                "actions": [
                    "Schedule urgent appointment with healthcare provider",
                    "Isolate to prevent transmission",
                    "Monitor temperature regularly",
                    "Get vaccination status reviewed"
                ]
            }
        else:
            return {
                "level": "MODERATE RISK",
                "recommendation": "Medical consultation recommended for confirmation and proper diagnosis.",
                "actions": [
                    "Schedule appointment with healthcare provider",
                    "Monitor symptoms closely",
                    "Maintain hygiene to prevent transmission"
                ]
            }
    else:
        return {
            "level": "LOW RISK",
            "recommendation": "Measles not likely detected. If symptoms persist, consult healthcare provider.",
            "actions": [
                "Monitor symptoms",
                "Maintain basic hygiene",
                "Follow up if symptoms worsen"
            ]
        }

def get_risk_level(prediction, confidence, symptom_count):
    """Determine risk level"""
    if prediction == "measles":
        if confidence > 0.8 and symptom_count >= 5:
            return "CRITICAL"
        elif confidence > 0.7 or symptom_count >= 6:
            return "HIGH"
        else:
            return "MODERATE"
    else:
        return "LOW"

if __name__ == '__main__':
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, host='0.0.0.0', port=port)
