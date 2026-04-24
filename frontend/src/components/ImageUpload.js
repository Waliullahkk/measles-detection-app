import React, { useState, useRef } from 'react';
import { Container, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaCamera, FaImage } from 'react-icons/fa';
import '../styles/ImageUpload.css';

const ImageUpload = ({ onImageCapture }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      setPreview(base64Image);
      setFileName(file.name);
      onImageCapture(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onImageCapture(null);
  };

  return (
    <Card className="shadow mb-4 image-upload-card">
      <Card.Header className="bg-primary text-white">
        <h5>📸 Upload Medical Image</h5>
      </Card.Header>
      <Card.Body>
        {preview ? (
          <div className="text-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="img-fluid rounded mb-3" 
              style={{ maxHeight: '300px', maxWidth: '100%' }}
            />
            <p className="text-muted">File: {fileName}</p>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={clearImage}
              className="mt-2"
            >
              Clear Image
            </Button>
          </div>
        ) : (
          <div className="d-grid gap-2">
            <div className="upload-buttons">
              <Button
                variant="outline-primary"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <FaImage /> Choose Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <Button
                variant="outline-info"
                onClick={() => cameraInputRef.current?.click()}
              >
                <FaCamera /> Take Photo
              </Button>
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ImageUpload;
