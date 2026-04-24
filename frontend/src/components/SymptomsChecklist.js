import React, { useState, useEffect } from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/SymptomsChecklist.css';

const SymptomsChecklist = ({ onSymptomsChange }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomsList, setSymptomsList] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize symptoms from API or mock data
    const defaultSymptoms = {
      fever: {
        description: "High fever (101-104°F or higher)",
        duration: "Usually appears first"
      },
      cough: {
        description: "Dry cough",
        duration: "Often present"
      },
      runny_nose: {
        description: "Runny or stuffy nose",
        duration: "Common symptom"
      },
      sore_throat: {
        description: "Sore throat",
        duration: "May be present"
      },
      red_eyes: {
        description: "Red, watery, light-sensitive eyes",
        duration: "Characteristic symptom"
      },
      koplik_spots: {
        description: "Koplik spots (white spots on mouth)",
        duration: "Appears 2-3 days before rash"
      },
      rash: {
        description: "Red rash starting on face/hairline",
        duration: "Appears 3-4 days after fever"
      },
      body_aches: {
        description: "Body aches and malaise",
        duration: "Often present"
      },
      fatigue: {
        description: "Extreme fatigue and weakness",
        duration: "Common throughout illness"
      },
      loss_of_appetite: {
        description: "Loss of appetite",
        duration: "May be present"
      }
    };
    
    setSymptomsList(defaultSymptoms);
    setLoading(false);
  }, []);

  const handleSymptomChange = (symptomKey) => {
    const newSymptoms = symptoms.includes(symptomKey)
      ? symptoms.filter(s => s !== symptomKey)
      : [...symptoms, symptomKey];
    
    setSymptoms(newSymptoms);
    onSymptomsChange(newSymptoms);
  };

  const handleSelectAll = () => {
    const allSymptomKeys = Object.keys(symptomsList);
    setSymptoms(allSymptomKeys);
    onSymptomsChange(allSymptomKeys);
  };

  const handleClearAll = () => {
    setSymptoms([]);
    onSymptomsChange([]);
  };

  if (loading) {
    return <div>Loading symptoms...</div>;
  }

  const symptomCount = symptoms.length;
  const totalSymptoms = Object.keys(symptomsList).length;

  return (
    <Card className="shadow mb-4 symptoms-card">
      <Card.Header className="bg-success text-white">
        <h5>✓ Measles Symptoms Checklist</h5>
        <p className="mb-0 small">
          Select symptoms present in the patient ({symptomCount}/{totalSymptoms})
        </p>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <button
            className="btn btn-sm btn-outline-success me-2"
            onClick={handleSelectAll}
          >
            Select All
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>

        {symptomCount >= 5 && (
          <Alert variant="warning" className="mb-3">
            <FaExclamationTriangle className="me-2" />
            Multiple symptoms detected - Consider medical consultation
          </Alert>
        )}

        <div className="symptoms-grid">
          {Object.entries(symptomsList).map(([key, symptom]) => (
            <div key={key} className="symptom-item mb-3">
              <Form.Check
                type="checkbox"
                id={key}
                label={
                  <div className="symptom-label">
                    <span className="symptom-name">{symptom.description}</span>
                    <span className="symptom-duration small text-muted">
                      {symptom.duration}
                    </span>
                  </div>
                }
                checked={symptoms.includes(key)}
                onChange={() => handleSymptomChange(key)}
                className="symptom-checkbox"
              />
            </div>
          ))}
        </div>

        {symptomCount > 0 && (
          <div className="symptom-summary mt-4 p-3 bg-light rounded">
            <h6>
              <FaCheckCircle className="me-2 text-success" />
              Selected Symptoms: {symptomCount}
            </h6>
            <div className="selected-symptoms">
              {symptoms.map(symptom => (
                <span key={symptom} className="badge bg-success me-2 mb-2">
                  {symptomsList[symptom]?.description}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SymptomsChecklist;
