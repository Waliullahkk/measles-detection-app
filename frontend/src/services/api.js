import axios from 'axios';

const API_ROOT = (process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const API_BASE_URL = `${API_ROOT}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const measlesAPI = {
  // Get list of measles symptoms
  getSymptoms: async () => {
    try {
      const response = await apiClient.get('/symptoms');
      return response.data;
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      throw error;
    }
  },

  // Make prediction with image and symptoms
  predict: async (imageBase64, symptoms, patientAge, patientGender) => {
    try {
      const response = await apiClient.post('/predict', {
        image: imageBase64,
        symptoms: symptoms,
        patient_age: patientAge,
        patient_gender: patientGender,
      });
      return response.data;
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  },

  // Get all prediction results
  getResults: async () => {
    try {
      const response = await apiClient.get('/results');
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },
};

export default apiClient;
