# System Architecture & Deployment Guide

## 🏗️ System Architecture

### Overview
```
┌─────────────────────────────────────────────┐
│           React Frontend (Port 3000)        │
│  ┌─────────────────────────────────────┐    │
│  │   - Image Upload                    │    │
│  │   - Symptoms Checklist              │    │
│  │   - Results Display                 │    │
│  │   - Dashboard Analytics             │    │
│  └─────────────────────────────────────┘    │
└───────────┬─────────────────────────────────┘
            │ HTTP/CORS
            ↓
┌─────────────────────────────────────────────┐
│       Flask Backend (Port 5000)             │
│  ┌─────────────────────────────────────┐    │
│  │   - Model Inference (ResNet18)      │    │
│  │   - Image Processing                │    │
│  │   - Symptom Analysis                │    │
│  │   - Risk Assessment                 │    │
│  │   - API Endpoints                   │    │
│  └─────────────────────────────────────┘    │
│                   ↓                         │
│  ┌─────────────────────────────────────┐    │
│  │   SQLite Database                   │    │
│  │   - Predictions Storage             │    │
│  │   - Statistics                      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 📦 Component Breakdown

### Frontend (React)
- **Image Upload Component**: Handles image capture/selection
- **Symptoms Checklist**: 10-item measles symptoms selection
- **Results Component**: Displays AI predictions and recommendations
- **Dashboard**: Analytics and statistics visualization
- **API Service**: Communicates with backend

### Backend (Flask)
- **Model Loading**: ResNet18 from checkpoint
- **Image Processing**: Resize to 224x224, normalize
- **Prediction Engine**: Model inference + confidence scoring
- **Risk Calculation**: Combined image + symptom analysis
- **Database Manager**: SQLite storage and retrieval

### Database (SQLite)
- **Predictions Table**: Stores all predictions
- **Auto-increment ID**: Unique prediction identifier
- **Timestamp**: When prediction was made
- **Patient Info**: Age, gender (optional)
- **Results**: Stored for reporting

---

## 🚀 Deployment Options

### Option 1: Local Development (Current Setup)
**Best for**: Learning, testing, local use

```bash
# Backend
python app.py  # Runs on http://127.0.0.1:5000

# Frontend  
npm start      # Runs on http://localhost:3000
```

**Pros**: Easy to setup, no configuration needed
**Cons**: Not suitable for production, limited access

---

### Option 2: Docker Deployment
**Best for**: Containerized deployment, consistent environments

#### Dockerfile for Backend
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

EXPOSE 5000

CMD ["python", "app.py"]
```

#### Dockerfile for Frontend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend/package.json package-lock.json ./
RUN npm install

COPY frontend/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

### Option 3: Cloud Deployment

#### AWS Deployment
```bash
# Using Elastic Beanstalk for backend
eb init
eb create measles-backend
eb deploy

# Using S3 + CloudFront for frontend
aws s3 sync build/ s3://measles-frontend-bucket
```

#### Heroku Deployment
```bash
# Backend
heroku create measles-backend
git push heroku main

# Frontend (with custom buildpack)
heroku create measles-frontend
git push heroku main
```

#### Azure Deployment
```bash
# Using App Service
az webapp up --name measles-app --runtime "python3.9"
az webapp up --name measles-frontend --runtime "node"
```

---

### Option 4: Production Linux Server

#### Install Dependencies
```bash
# Backend dependencies
sudo apt-get update
sudo apt-get install python3 python3-pip python3-venv

# Frontend dependencies
sudo apt-get install nodejs npm

# Web server
sudo apt-get install nginx
```

#### Setup Backend Service
```bash
# Create system service
sudo nano /etc/systemd/system/measles-backend.service
```

```ini
[Unit]
Description=Measles Detection Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/measles/backend
Environment="PATH=/opt/measles/venv/bin"
ExecStart=/opt/measles/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}
```

---

## 🔒 Security Considerations

### CORS Configuration
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["POST", "GET"],
        "max_age": 3600
    }
})
```

### Input Validation
- Image size limits (5MB max)
- Base64 validation
- Symptom key validation
- Age range validation (0-150)

### Environment Variables
```bash
FLASK_ENV=production
DEBUG=False
MODEL_PATH=/opt/models/measles_model.pt
DATABASE_PATH=/var/data/predictions.db
```

---

## 📊 Performance Optimization

### Frontend Optimization
- Lazy load components
- Image compression before upload
- Cache API responses
- Code splitting

### Backend Optimization
```python
# Use batch processing
# Implement caching
# Use GPU acceleration
# Connection pooling
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Measles Detection

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: pip install -r backend/requirements.txt
      
      - name: Run tests
        run: pytest backend/tests/
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deployment commands here
```

---

## 📈 Monitoring & Logging

### Backend Monitoring
```python
import logging
from logging.handlers import RotatingFileHandler

file_handler = RotatingFileHandler('app.log', maxBytes=10240, backupCount=10)
logging.basicConfig(
    handlers=[file_handler],
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)
```

### Frontend Monitoring
```javascript
// Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
});
```

---

## 🚨 Scaling Considerations

### Database Scaling
```bash
# Switch to PostgreSQL for larger datasets
# Implement connection pooling
# Add database replication
```

### API Scaling
```bash
# Load balancing (nginx, HAProxy)
# Horizontal scaling with multiple Flask instances
# Caching layer (Redis)
```

### Model Optimization
```bash
# Model quantization
# Batch processing
# GPU acceleration (CUDA)
# Model serving (TensorFlow Serving)
```

---

## 🔧 Maintenance

### Regular Tasks
1. **Daily**: Monitor logs, check database size
2. **Weekly**: Backup database, review statistics
3. **Monthly**: Update dependencies, security patches
4. **Quarterly**: Performance optimization, model updates

### Database Maintenance
```bash
# Backup database
sqlite3 measles_detection.db ".backup backup.db"

# Optimize database
sqlite3 measles_detection.db "VACUUM;"

# Check database integrity
sqlite3 measles_detection.db "PRAGMA integrity_check;"
```

---

## 📋 Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Model file accessible
- [ ] CORS configured correctly
- [ ] SSL certificate (for HTTPS)
- [ ] Domain configured
- [ ] Firewall rules set
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Security audit completed

---

## 🆘 Troubleshooting Deployment

### Backend Won't Connect
- Check firewall rules
- Verify port 5000 is open
- Check Flask logs

### Frontend Can't Reach API
- Ensure backend is running
- Check CORS configuration
- Verify API URL in frontend config

### Database Issues
- Check disk space
- Verify write permissions
- Review error logs

---

**Last Updated**: April 24, 2026
