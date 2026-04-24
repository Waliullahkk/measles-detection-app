# Quick Start Guide - Measles Detection System

## 🚀 Get Started in 5 Minutes

### Option 1: Windows Users (Fastest)

#### Terminal 1 - Start Backend
```bash
cd e:\measles\measles_detection_app
start_backend.bat
```
✅ Wait for: `Running on http://127.0.0.1:5000`

#### Terminal 2 - Start Frontend  
```bash
cd e:\measles\measles_detection_app
start_frontend.bat
```
✅ Wait for: `Compiled successfully!`

#### Open Browser
```
http://localhost:3000
```

---

### Option 2: Manual Setup (All Platforms)

#### Backend (Terminal 1)
```bash
cd e:\measles\measles_detection_app\backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
python app.py
```

#### Frontend (Terminal 2)
```bash
cd e:\measles\measles_detection_app\frontend
npm install
npm start
```

---

## ✨ Features at a Glance

### 🖼️ Image Analysis
- Upload medical images (JPEG, PNG)
- Camera capture support
- Real-time preview

### ✓ Symptoms Checklist
- 10 key measles symptoms
- Select All / Clear All buttons
- Symptom descriptions and duration info

### 🧠 AI-Powered Detection
- ResNet18 deep learning model
- 70% image + 30% symptoms analysis
- Confidence score display

### ⚠️ Risk Assessment
- **CRITICAL** / **HIGH** / **MODERATE** / **LOW**
- Medical recommendations
- Actionable next steps
- Report download

### 📊 Dashboard
- Real-time statistics
- Prediction trends
- Case analysis
- Charts and graphs

---

## 📸 How to Use

### Step 1: Upload Image
Click "Choose Image" or "Take Photo"

### Step 2: Select Symptoms
Check symptoms from the 10-item checklist

### Step 3: Enter Patient Info (Optional)
- Age
- Gender (M/F/Other)

### Step 4: Analyze
Click "Analyze Image & Symptoms"

### Step 5: Review Results
- View diagnosis
- Check recommendations
- Download report

---

## 🔧 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process: `netstat -ano \| findstr :5000` |
| Port 3000 in use | Kill process: `netstat -ano \| findstr :3000` |
| Module not found | Run: `pip install -r requirements.txt` |
| npm command not found | Install Node.js from nodejs.org |
| API connection error | Ensure backend is running on 5000 |

---

## 💡 Pro Tips

✅ Use clear, well-lit images
✅ Select accurate symptoms
✅ Provide patient age for better risk assessment
✅ Always consult a healthcare professional
✅ Check Dashboard for system statistics

---

## 📋 Symptoms Checklist

When using the system, select from these 10 symptoms:

1. **Fever** - High fever (101-104°F+)
2. **Cough** - Dry cough
3. **Runny Nose** - Runny or stuffy nose
4. **Sore Throat** - Sore throat
5. **Red Eyes** - Red, watery, light-sensitive eyes
6. **Koplik Spots** - White spots on mouth
7. **Rash** - Red rash on face/hairline
8. **Body Aches** - Body aches and malaise
9. **Fatigue** - Extreme fatigue and weakness
10. **Loss of Appetite** - Loss of appetite

---

## 🌐 Access Portals

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://127.0.0.1:5000
- **API Health Check**: http://127.0.0.1:5000/health

---

## ⚠️ Important Note

This system is for **informational purposes only**. Always consult qualified healthcare professionals for medical diagnosis and treatment.

---

## 📚 Full Documentation

For detailed information, see:
- [README.md](README.md) - Complete documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions

---

**Enjoy using the Measles Detection System! 🎉**
