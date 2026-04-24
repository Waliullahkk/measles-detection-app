import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { FaHeartbeat, FaChartBar, FaHome } from 'react-icons/fa';
import DetectionPage from './pages/DetectionPage';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [activePage, setActivePage] = useState('detection');

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand href="#" className="brand-logo">
            <FaHeartbeat className="me-2" />
            Measles Detection System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                active={activePage === 'detection'}
                onClick={() => setActivePage('detection')}
                className="nav-link-custom me-2"
              >
                <FaHome className="me-1" />
                Detection
              </Nav.Link>
              <Nav.Link
                active={activePage === 'dashboard'}
                onClick={() => setActivePage('dashboard')}
                className="nav-link-custom"
              >
                <FaChartBar className="me-1" />
                Dashboard
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="main-content">
        {activePage === 'detection' ? <DetectionPage /> : <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="footer mt-5 py-4 bg-dark text-white text-center">
        <Container>
          <p className="mb-2">
            <strong>Measles Detection AI System</strong>
          </p>
          <p className="mb-0 small text-muted">
            ⚠️ This system is for informational purposes only. 
            Always consult qualified healthcare professionals for medical diagnosis and treatment.
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
