import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import ImageUpload from '../components/ImageUpload';
import SymptomsChecklist from '../components/SymptomsChecklist';
import Results from '../components/Results';
import { measlesAPI } from '../services/api';
import '../styles/Detection.css';

const DetectionPage = () => {
  const [image, setImage] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageCapture = (imageBase64) => {
    setImage(imageBase64);
    setError(null);
  };

  const handleSymptomsChange = (selectedSymptoms) => {
    setSymptoms(selectedSymptoms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove the data:image/...;base64, prefix if present
      let imageData = image;
      if (imageData.startsWith('data:')) {
        imageData = imageData.split(',')[1];
      }

      const response = await measlesAPI.predict(
        imageData,
        symptoms,
        patientAge ? parseInt(patientAge) : null,
        patientGender || null
      );

      setResults(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Error making prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setSymptoms([]);
    setPatientAge('');
    setPatientGender('');
    setResults(null);
    setError(null);
  };

  if (results) {
    return (
      <Container className="detection-page mt-5 mb-5">
        <Results results={results} onBack={handleReset} />
      </Container>
    );
  }

  return (
    <Container fluid className="detection-page mt-4 mb-5">
      <Row className="mb-4">
        <Col md={12}>
          <h1 className="text-center mb-2">Measles Detection System</h1>
          <p className="text-center text-muted">
            Upload an image and select symptoms for AI-powered analysis
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={6} className="mb-4">
          <ImageUpload onImageCapture={handleImageCapture} />

          {image && (
            <div className="patient-info-section">
              <h5 className="mb-3">👤 Patient Information</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Age (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter patient age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    min="0"
                    max="120"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gender (Optional)</Form.Label>
                  <Form.Select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>
          )}
        </Col>

        <Col lg={6} className="mb-4">
          <SymptomsChecklist onSymptomsChange={handleSymptomsChange} />
        </Col>
      </Row>

      {image && (
        <Row className="mt-4">
          <Col md={12}>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={loading || !image}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image & Symptoms'
                )}
              </Button>

              {!loading && (
                <Button
                  variant="outline-secondary"
                  onClick={handleReset}
                >
                  Clear All
                </Button>
              )}
            </div>
          </Col>
        </Row>
      )}

      {!image && (
        <Row className="mt-5">
          <Col md={12} className="text-center">
            <div className="info-section p-4 rounded bg-light">
              <h5 className="mb-3">How to Use</h5>
              <ol className="text-start" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <li>Upload a clear image of the patient (especially for skin rash/symptoms)</li>
                <li>Select symptoms experienced by the patient from the checklist</li>
                <li>Enter patient age and gender (optional)</li>
                <li>Click "Analyze" to get the diagnosis</li>
              </ol>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DetectionPage;
