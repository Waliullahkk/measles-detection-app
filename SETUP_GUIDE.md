# Measles Detection System - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Windows
- **Python 3.8+** - Download from [python.org](https://www.python.org)
  - ✓ Check "Add Python to PATH" during installation
- **Node.js & npm** - Download from [nodejs.org](https://nodejs.org)
  - ✓ Choose LTS version

### Linux/Mac
- **Python 3.8+** - Install via package manager
  - Ubuntu: `sudo apt-get install python3 python3-pip`
  - Mac: `brew install python3 node`
- **Node.js & npm** - Install via package manager
  - Ubuntu: `sudo apt-get install nodejs npm`
  - Mac: `brew install node`

## 🔍 Verify Installation

Open terminal/command prompt and run:

```bash
python --version      # Should show Python 3.8+
pip --version         # Should show pip version
node --version        # Should show Node.js version
npm --version         # Should show npm version
```

## 🚀 Installation Steps

### Step 1: Backend Setup

#### Option A: Windows (Easy)
1. Double-click `start_backend.bat`
2. Wait for dependencies to install
3. Flask will start automatically

#### Option B: Manual (All Platforms)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

✅ **Backend Ready** when you see:
```
 * Running on http://127.0.0.1:5000
```

### Step 2: Frontend Setup

#### Option A: Windows (Easy)
1. Open new terminal window
2. Double-click `start_frontend.bat`
3. Wait for dependencies to install
4. React will start automatically

#### Option B: Manual (All Platforms)
```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ **Frontend Ready** when you see:
```
Compiled successfully!
```

## 🌐 Access the Application

Once both servers are running:

1. **Open browser** to: `http://localhost:3000`
2. You should see the Measles Detection interface
3. Make sure both backend and frontend are running

## 📖 Using the Application

### Detection Page

1. **Upload Image**
   - Click "Choose Image" or "Take Photo"
   - Select a clear medical image

2. **Enter Patient Info** (Optional)
   - Age: Patient's age
   - Gender: M/F/Other

3. **Select Symptoms**
   - Check symptoms from the list
   - Click "Select All" or manually choose
   - Aim for 5+ symptoms for better accuracy

4. **Analyze**
   - Click "Analyze Image & Symptoms"
   - Wait for AI analysis to complete
   - View results and recommendations

### Dashboard

1. **Statistics**
   - Total predictions made
   - Measles cases detected
   - Average model confidence
   - Recent predictions table

2. **Charts**
   - Pie chart: Measles distribution
   - Bar chart: Case overview

## 🛑 Stopping the Application

- **Backend**: Press `Ctrl+C` in backend terminal
- **Frontend**: Press `Ctrl+C` in frontend terminal

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "Port 5000 already in use"**
```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

**Error: "ModuleNotFoundError"**
```bash
# Ensure virtual environment is activated
# Then reinstall dependencies
pip install -r requirements.txt
```

### Frontend Won't Start

**Error: "npm command not found"**
- Ensure Node.js is installed
- Restart terminal after installation
- Add Node.js to PATH

**Error: "Port 3000 already in use"**
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### API Connection Error

- Verify backend is running on `http://127.0.0.1:5000`
- Check browser console for errors (F12)
- Ensure CORS is enabled in Flask

### Image Upload Issues

- Image must be JPEG or PNG
- Keep image size under 5MB
- Ensure good lighting and clarity

## 📦 Project Files

### Key Backend Files
- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `measles_detection.db` - SQLite database (auto-created)

### Key Frontend Files
- `src/App.js` - Main React component
- `src/pages/DetectionPage.js` - Detection interface
- `src/components/Dashboard.js` - Analytics dashboard
- `package.json` - Node dependencies

## 💡 Tips for Best Results

1. **Image Quality**: Upload clear, well-lit photos
2. **Symptoms**: Select accurate symptoms for better analysis
3. **Age & Gender**: Provide for better risk assessment
4. **Review Results**: Always review recommendations
5. **Medical Consultation**: Never rely solely on this system

## 🔒 Data Storage

- All predictions are stored locally in SQLite database
- No data is sent to external servers
- Database file: `measles_detection.db` in backend directory

## 📊 Monitoring the System

### Check Recent Predictions
```bash
# List recent database entries
sqlite3 backend/measles_detection.db "SELECT * FROM predictions LIMIT 10;"
```

### View Application Logs
- Backend logs: Visible in terminal running Flask
- Frontend logs: Browser console (Press F12)

## 🚀 Production Deployment

For production use:

1. **Backend**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.py
```

2. **Frontend**
```bash
npm run build
# Serve build folder with nginx/Apache
```

## 📱 Mobile Access

To access from other devices:

1. Find your computer's IP: 
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig`

2. Access from mobile:
   - `http://<YOUR_IP>:3000`

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review terminal/console logs
3. Verify all requirements are installed
4. Check file paths are correct
5. Restart both services

## ✅ Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js & npm installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser shows Measles Detection interface
- [ ] Image upload works
- [ ] Symptom selection works
- [ ] Analysis completes successfully

## 📞 System Requirements

**Minimum:**
- 4GB RAM
- Multi-core processor
- 500MB free disk space

**Recommended:**
- 8GB+ RAM
- GPU (NVIDIA with CUDA support) for faster analysis
- 2GB free disk space
- High-speed internet (for initial setup)

---
**Setup Completed!** 🎉

Your Measles Detection System is now ready to use.

For detailed usage information, see [README.md](README.md)
