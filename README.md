# Measles Detection Web Application

## 🏥 Overview
A complete web application for AI-powered measles detection combining:
- **Deep Learning Model**: ResNet18 trained on measles dataset
- **Symptoms Checklist**: 10-point symptom assessment
- **Dashboard**: Real-time statistics and analysis
- **User-Friendly Interface**: React-based responsive frontend
- **REST API**: Flask backend with CORS support

## 📁 Project Structure

```
measles_detection_app/
├── backend/
│   ├── app.py                 # Flask application with model integration
│   ├── requirements.txt       # Python dependencies
│   └── measles_detection.db   # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ImageUpload.js          # Image upload component
    │   │   ├── SymptomsChecklist.js    # Symptoms checklist
    │   │   ├── Results.js              # Results display
    │   │   └── Dashboard.js            # Analytics dashboard
    │   │
    │   ├── pages/
    │   │   └── DetectionPage.js        # Main detection page
    │   │
    │   ├── services/
    │   │   └── api.js                  # API client
    │   │
    │   ├── styles/
    │   │   ├── index.css
    │   │   ├── App.css
    │   │   ├── Detection.css
    │   │   ├── ImageUpload.css
    │   │   ├── SymptomsChecklist.css
    │   │   ├── Results.css
    │   │   └── Dashboard.css
    │   │
    │   ├── App.js
    │   └── index.js
    │
    ├── public/
    │   └── index.html
    │
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start Flask server**
   ```bash
   python app.py
   ```
   The backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. **Install Node dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start React development server**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 🎯 Features

### 1. Image Analysis
- Upload medical images (JPEG, PNG)
- Real-time image preview
- Support for camera capture on mobile devices

### 2. Symptom Checklist
10 key measles symptoms:
- ✓ Fever (101-104°F+)
- ✓ Dry cough
- ✓ Runny or stuffy nose
- ✓ Sore throat
- ✓ Red, watery, light-sensitive eyes
- ✓ Koplik spots (white spots on mouth)
- ✓ Red rash starting on face/hairline
- ✓ Body aches and malaise
- ✓ Extreme fatigue and weakness
- ✓ Loss of appetite

### 3. AI Analysis
- ResNet18 deep learning model
- 70% image analysis weight
- 30% symptom analysis weight
- Confidence score display
- Decision threshold: 0.26

### 4. Risk Assessment
Risk levels:
- **CRITICAL**: High confidence + many symptoms
- **HIGH**: High confidence or 6+ symptoms
- **MODERATE**: Moderate confidence + 5+ symptoms
- **LOW**: Non-measles or low confidence

### 5. Results & Recommendations
- Clear diagnosis presentation
- Medical recommendations
- Actionable next steps
- Report download functionality

### 6. Dashboard
- Total predictions count
- Measles vs non-measles statistics
- Average confidence tracking
- Recent predictions table
- Visual charts (Pie and Bar)

## 📊 API Endpoints

### Health Check
```
GET /health
```

### Get Symptoms List
```
GET /api/symptoms
```

### Make Prediction
```
POST /api/predict
Content-Type: application/json

{
  "image": "base64_encoded_image",
  "symptoms": ["fever", "rash", "red_eyes"],
  "patient_age": 25,
  "patient_gender": "M"
}
```

### Get Results
```
GET /api/results
```

### Get Statistics
```
GET /api/statistics
```

## 🔧 Configuration

### Model Configuration
Edit `app.py` to modify:
```python
MODEL_PATH = r"path_to_model.pt"
DECISION_THRESHOLD = 0.26  # Adjustable
```

### API Configuration
```python
CORS(app)  # Enable cross-origin requests
DEBUG = True  # Development mode
```

## 💾 Database Schema

### Predictions Table
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    prediction TEXT,
    confidence REAL,
    symptoms TEXT,
    patient_age INTEGER,
    patient_gender TEXT,
    result TEXT
);
```

## 🧠 Model Information

- **Architecture**: ResNet18
- **Input Size**: 224x224 pixels
- **Classes**: Measles / Non-Measles
- **Training Data**: 755 images
- **Decision Threshold**: 0.26
- **Device**: CUDA (GPU) if available, CPU otherwise

## ⚠️ Medical Disclaimer

This system is **FOR INFORMATIONAL PURPOSES ONLY**. It is not a substitute for:
- Professional medical advice
- Clinical diagnosis
- Medical treatment

Always consult with qualified healthcare professionals for:
- Medical diagnosis
- Treatment decisions
- Patient care

## 🔒 Privacy & Security

- All predictions stored locally in SQLite database
- No data sent to external services
- Images processed locally on the server
- CORS configured for frontend communication only

## 🛠️ Technologies

### Backend
- Flask 2.3.2
- PyTorch 2.0.1
- torchvision 0.15.2
- Python 3.8+

### Frontend
- React 18.2.0
- Bootstrap 5.3.0
- Chart.js 3.9.1
- Axios 1.4.0

## 📝 Usage Examples

### Example 1: Detection with Image and Symptoms
1. Upload a clear image of symptoms (rash, skin condition)
2. Select 5+ symptoms from the checklist
3. Enter patient age and gender (optional)
4. Click "Analyze Image & Symptoms"
5. View results and recommendations

### Example 2: Dashboard Analysis
1. Navigate to Dashboard tab
2. View statistics from all predictions
3. Check recent predictions
4. Monitor trends and patterns

## 🐛 Troubleshooting

### Backend Issues
- **Model not found**: Ensure model path is correct in `app.py`
- **CUDA errors**: Install compatible PyTorch version
- **Port already in use**: Change `port=5000` in `app.py`

### Frontend Issues
- **API connection error**: Ensure backend is running on port 5000
- **Image upload fails**: Check file size and format
- **Dashboard data missing**: Wait for database to populate

## 🚀 Deployment

### Production Setup
1. Install gunicorn: `pip install gunicorn`
2. Run: `gunicorn -w 4 -b 0.0.0.0:5000 app.py`
3. Build React: `npm run build`
4. Serve with nginx or Apache

## 📚 Additional Resources

- [PyTorch Documentation](https://pytorch.org)
- [Flask Documentation](https://flask.palletsprojects.com)
- [React Documentation](https://react.dev)
- [Bootstrap Documentation](https://getbootstrap.com)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Verify all dependencies are installed

## 📄 License

This project is provided as-is for research and educational purposes.

---
**Last Updated**: April 24, 2026
**Version**: 1.0.0
