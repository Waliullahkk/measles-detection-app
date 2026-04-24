import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaChartBar, FaDatabase, FaUser } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { measlesAPI } from '../services/api';
import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, resultsData] = await Promise.all([
        measlesAPI.getStatistics(),
        measlesAPI.getResults(),
      ]);
      setStatistics(statsData);
      setResults(resultsData.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const chartData = statistics ? {
    labels: ['Measles', 'Non-Measles'],
    datasets: [
      {
        data: [statistics.measles_cases, statistics.non_measles_cases],
        backgroundColor: ['#dc3545', '#28a745'],
        borderColor: ['#c82333', '#1e7e34'],
        borderWidth: 2,
      },
    ],
  } : null;

  const barData = statistics ? {
    labels: ['Total Predictions', 'Measles Cases'],
    datasets: [
      {
        label: 'Count',
        data: [statistics.total_predictions, statistics.measles_cases],
        backgroundColor: ['#0d6efd', '#dc3545'],
        borderColor: ['#0a58ca', '#bb2d3b'],
        borderWidth: 2,
      },
    ],
  } : null;

  return (
    <Container fluid className="dashboard-container mt-4">
      <h2 className="mb-4">
        <FaChartBar className="me-2" />
        Dashboard
      </h2>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stat-card shadow">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Predictions</h6>
              <h2 className="text-primary">
                {statistics?.total_predictions || 0}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="stat-card shadow">
            <Card.Body className="text-center">
              <h6 className="text-muted">Measles Cases</h6>
              <h2 className="text-danger">
                {statistics?.measles_cases || 0}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="stat-card shadow">
            <Card.Body className="text-center">
              <h6 className="text-muted">Non-Measles Cases</h6>
              <h2 className="text-success">
                {statistics?.non_measles_cases || 0}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="stat-card shadow">
            <Card.Body className="text-center">
              <h6 className="text-muted">Avg Confidence</h6>
              <h2 className="text-info">
                {(statistics?.average_confidence * 100).toFixed(1)}%
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Prediction Distribution</h5>
            </Card.Header>
            <Card.Body>
              {chartData && <Pie data={chartData} options={{ responsive: true }} />}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Cases Overview</h5>
            </Card.Header>
            <Card.Body>
              {barData && <Bar data={barData} options={{ responsive: true }} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Results */}
      <Row>
        <Col md={12}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <FaDatabase className="me-2" />
                Recent Predictions
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Prediction</th>
                      <th>Confidence</th>
                      <th>Symptoms</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 10).map((result, idx) => (
                      <tr key={idx}>
                        <td>
                          <small>{new Date(result.timestamp).toLocaleString()}</small>
                        </td>
                        <td>
                          <strong>{result.prediction}</strong>
                        </td>
                        <td>
                          <strong>{(result.confidence * 100).toFixed(2)}%</strong>
                        </td>
                        <td>
                          <small>{result.symptoms?.split(',').length || 0} symptoms</small>
                        </td>
                        <td>{result.patient_age || 'N/A'}</td>
                        <td>{result.patient_gender || 'N/A'}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              result.result === 'measles' ? 'danger' : 'success'
                            }`}
                          >
                            {result.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
