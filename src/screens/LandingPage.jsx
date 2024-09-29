import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/register'); // Redirect to the sign-in page
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#131722' }}>
      <Container className="text-center">
        <h1 style={{ color: 'white' }}>Welcome to Portfolio Builder</h1>
        <p style={{ color: 'white' }}>Create and customize your portfolio easily with our drag-and-drop builder.</p>
        <Button variant="primary" onClick={handleSignInClick}>
          Sign In to Get Started
        </Button>
      </Container>
    </div>
  );
};

export default LandingPage;
