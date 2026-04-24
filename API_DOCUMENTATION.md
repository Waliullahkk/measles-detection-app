# Measles Detection API Documentation

## 🔌 Base URL
```
http://127.0.0.1:5000
```

---

## 📡 Endpoints

### 1. Health Check
**Get system health status**

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "device": "cuda"  // or "cpu"
}
```

---

### 2. Get Symptoms
**Retrieve list of measles symptoms**

```http
GET /api/symptoms
```

**Response:**
```json
{
  "symptoms": {
    "fever": {
      "description": "High fever (101-104°F or higher)",
      "duration": "Usually appears first"
    },
    "cough": {
      "description": "Dry cough",
      "duration": "Often present"
    },
    ...
  },
  "total_symptoms": 10
}
```

---

### 3. Make Prediction
**Analyze image and symptoms for measles detection**

```http
POST /api/predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "image": "base64_encoded_image_string",
  "symptoms": ["fever", "rash", "red_eyes"],
  "patient_age": 25,
  "patient_gender": "M"
}
```

**Response (Success):**
```json
{
  "success": true,
  "model_prediction": "measles",
  "model_confidence": 0.85,
  "symptoms_provided": ["fever", "rash", "red_eyes"],
  "symptom_count": 3,
  "final_prediction": "measles",
  "final_confidence": 0.7650,
  "recommendation": {
    "level": "HIGH RISK",
    "recommendation": "Immediate medical consultation strongly recommended...",
    "actions": [
      "Schedule urgent appointment with healthcare provider",
      "Isolate to prevent transmission",
      "Monitor temperature regularly",
      "Get vaccination status reviewed"
    ]
  },
  "risk_level": "HIGH"
}
```

**Response (Error):**
```json
{
  "error": "No image provided"
}
```

**Status Codes:**
- `200` - Successful prediction
- `400` - Bad request (missing image)
- `500` - Server error

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| image | string (base64) | ✓ | Base64 encoded image |
| symptoms | array | ✗ | Array of symptom keys |
| patient_age | integer | ✗ | Patient age (0-120) |
| patient_gender | string | ✗ | M, F, or O |

---

### 4. Get All Results
**Retrieve prediction history**

```http
GET /api/results
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "timestamp": "2026-04-24 10:30:45",
      "prediction": "measles",
      "confidence": 0.85,
      "symptoms": "[\"fever\",\"rash\"]",
      "patient_age": 25,
      "patient_gender": "M",
      "result": "measles"
    },
    {
      "id": 2,
      "timestamp": "2026-04-24 10:15:30",
      "prediction": "not_measles",
      "confidence": 0.42,
      "symptoms": "[]",
      "patient_age": 35,
      "patient_gender": "F",
      "result": "not_measles"
    }
  ],
  "total": 2
}
```

**Limit:** Returns last 100 predictions

---

### 5. Get Statistics
**Retrieve prediction statistics**

```http
GET /api/statistics
```

**Response:**
```json
{
  "total_predictions": 42,
  "measles_cases": 15,
  "non_measles_cases": 27,
  "measles_percentage": 35.71,
  "average_confidence": 0.72
}
```

---

## 🔄 Request/Response Examples

### Example 1: Predict Measles from Image

**Request:**
```bash
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "symptoms": ["fever", "rash", "red_eyes", "cough"],
    "patient_age": 28,
    "patient_gender": "F"
  }'
```

**Response:**
```json
{
  "success": true,
  "model_prediction": "measles",
  "model_confidence": 0.91,
  "final_prediction": "measles",
  "final_confidence": 0.8435,
  "risk_level": "CRITICAL",
  "recommendation": {
    "level": "HIGH RISK",
    "recommendation": "Immediate medical consultation strongly recommended...",
    "actions": [...]
  }
}
```

---

### Example 2: Get Recent Results

**Request:**
```bash
curl http://127.0.0.1:5000/api/results
```

**Response:**
```json
{
  "results": [...],
  "total": 42
}
```

---

## 📊 Response Fields Explanation

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether prediction was successful |
| model_prediction | string | Raw model output: "measles" or "not_measles" |
| model_confidence | float | Model confidence (0.0-1.0) |
| symptoms_provided | array | Symptoms provided by user |
| symptom_count | integer | Number of symptoms selected |
| final_prediction | string | Final diagnosis after threshold |
| final_confidence | float | Combined confidence score |
| risk_level | string | CRITICAL, HIGH, MODERATE, or LOW |
| recommendation | object | Medical recommendations |

---

## 🎯 Risk Level Determination

```
CRITICAL: final_prediction="measles" AND confidence > 0.8 AND symptom_count >= 5
HIGH: final_prediction="measles" AND (confidence > 0.7 OR symptom_count >= 6)
MODERATE: final_prediction="measles" AND symptom_count >= 5
LOW: final_prediction="not_measles" OR low confidence
```

---

## 💾 Database Schema

### Predictions Table
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    prediction TEXT,           -- "measles" or "not_measles"
    confidence REAL,           -- 0.0 to 1.0
    symptoms TEXT,             -- JSON array as string
    patient_age INTEGER,       -- 0-120 or NULL
    patient_gender TEXT,       -- "M", "F", "O", or NULL
    result TEXT                -- "measles" or "not_measles"
);
```

---

## 🔐 CORS Configuration

The API allows requests from:
- `http://localhost:3000` (frontend)
- `http://127.0.0.1:3000`

---

## ⚙️ Configuration Parameters

### Model Configuration
```python
MODEL_PATH = "measles_best_model_trained.pt"
CLASS_IDX_PATH = "class_to_idx.json"
DECISION_THRESHOLD = 0.26
```

### Image Processing
```
Input Size: 224x224 pixels
Normalization: ImageNet mean/std
Supported Formats: JPEG, PNG
```

### Confidence Calculation
```
Final Confidence = (0.7 × Model Confidence) + (0.3 × Symptom Score)
```

---

## 🚨 Error Handling

### Error Responses

**400 - Bad Request**
```json
{
  "error": "No image provided"
}
```

**400 - Invalid Image**
```json
{
  "error": "Cannot decode image"
}
```

**500 - Server Error**
```json
{
  "error": "Internal server error occurred"
}
```

---

## 🔄 Rate Limiting

- No built-in rate limiting
- Database queries limited to 100 results max
- For production, consider adding rate limiting middleware

---

## 📈 Performance Metrics

| Operation | Avg Time | Notes |
|-----------|----------|-------|
| Image Upload | < 1s | Depends on image size |
| Model Inference | 100-500ms | Faster on GPU |
| Database Query | < 50ms | SQLite optimization |
| API Response | < 1s | End-to-end |

---

## 🔍 Testing the API

### Using Python
```python
import requests
import base64

# Test health check
response = requests.get('http://127.0.0.1:5000/health')
print(response.json())

# Test symptoms endpoint
response = requests.get('http://127.0.0.1:5000/api/symptoms')
print(response.json())

# Test statistics
response = requests.get('http://127.0.0.1:5000/api/statistics')
print(response.json())
```

### Using Postman
1. Import endpoints as collection
2. Set base URL to `http://127.0.0.1:5000`
3. Test each endpoint

---

## 📝 API Version History

### Version 1.0.0 (April 24, 2026)
- ✓ Image prediction endpoint
- ✓ Symptoms management
- ✓ Results storage
- ✓ Statistics dashboard
- ✓ Risk assessment

---

## 📞 Support

For API issues:
1. Check request format matches documentation
2. Verify backend is running
3. Check console for error messages
4. Review database for stored predictions

---

**Last Updated**: April 24, 2026
**API Version**: 1.0.0
