import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import dumbbell from '../images/portfolio (1).png';
import logo from '../images/porthub_logo.png'; 
import portfolio from '../images/bub the builder AI.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePortfolioClick = () => {
    navigate('/portfolio');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleTemplatesClick = () => {
    navigate('/template');
  };

  // Enhanced 3D tilt effect for portfolio card and buttons
  useEffect(() => {
    const elementsToTilt = document.querySelectorAll('.tilt-element');

    const handleMouseMove = (e, element) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / 20;
      const deltaY = (e.clientY - centerY) / 20;

      element.style.transform = `perspective(500px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) scale(1.05)`;
    };

    const resetTilt = (element) => {
      element.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg) scale(1)';
    };

    // Attach event listeners for tilt effect
    elementsToTilt.forEach((element) => {
      element.addEventListener('mousemove', (e) => handleMouseMove(e, element));
      element.addEventListener('mouseleave', () => resetTilt(element));
    });

    return () => {
      // Cleanup event listeners
      elementsToTilt.forEach((element) => {
        element.removeEventListener('mousemove', (e) => handleMouseMove(e, element));
        element.removeEventListener('mouseleave', () => resetTilt(element));
      });
    };
  }, []);

  // Social card animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    }, { threshold: 0.5 });

    const socialCards = document.querySelectorAll(".landing-social-card");
    socialCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Top bar */}
      <div className="landing-top-bar">
        <div className="landing-top-bar-left">
          <img src={logo} alt="PORTHUB Logo" className="logo" />
        </div>
        <div className="landing-top-bar-center">
          <button className="landing-top-bar-btn templates-btn" onClick={handleTemplatesClick}>
            Templates
          </button>
        </div>
        <div className="landing-top-bar-right">
          <button className="landing-top-bar-btn login-btn" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>

      {/* Main Content */}
      <Container fluid>
        <Row className="align-items-center">
          {/* Left Section: Social Media Cards */}
          <Col md={2} className="landing-social-media-cards-container">
            <div className="landing-social-media-cards">
              <div className="landing-social-card instagram-card tilt-element">
                <i className="fab fa-instagram"></i>
              </div>
              <div className="landing-social-card twitter-card tilt-element">
                <i className="fab fa-twitter"></i>
              </div>
              <div className="landing-social-card youtube-card tilt-element">
                <i className="fab fa-youtube"></i>
              </div>
              <div className="landing-social-card tiktok-card tilt-element">
                <i className="fab fa-tiktok"></i>
              </div>
            </div>
          </Col>

          {/* Right Section: Portfolio */}
          <Col md={4} className="landing-portfolio-section d-flex justify-content-end">
            <img src={dumbbell} alt="Dumbbell" className="landing-dumbbell-img" />
            <Card className="landing-portfolio-card tilt-element">
              <div className="landing-oval-shape"></div>
              <div className="customize-portfolio-left">
                <h2 className="customize-portfolio-title">
                  You can customize your portfolio<br /> with this amazing fonts and color
                </h2>
              </div>
              <Card.Body>
                <div className="landing-portfolio-header">
                  <div className="landing-portfolio-avatar-container">
                    <img src={portfolio} alt="PORTHUB Logo" className="landing-portfolio-avatar" />
                  </div>
                  <div className="landing-portfolio-info">
                    <h5>John the Builder</h5>
                  </div>
                </div>
                <div className="landing-portfolio-buttons">
                  <button className="landing-portfolio-btn tilt-element">Projects</button>
                  <button className="landing-portfolio-btn tilt-element">Services</button>
                  <button className="landing-portfolio-btn tilt-element" onClick={handlePortfolioClick}>
                    View Portfolio
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Centered Text with Gradient Shapes */}
      <div className="landing-centered-text text-center">
        <div className="landing-gradient-shape landing-shape-left-top"></div>
        <div className="landing-gradient-shape landing-shape-left-bottom"></div>
        <div className="landing-gradient-shape landing-shape-right-top"></div>
        <div className="landing-gradient-shape landing-shape-right-bottom"></div>

        {/* Main Text */}
        <h1>Find here for your next best portfolio</h1>
        <p className="landing-description-text">
          No more manual portfolio designs! With us, unlock inspiring portfolio designs in mere seconds—no need to spend hours brainstorming.
          Get ready to showcase your best work effortlessly.
        </p>
        <button className="landing-sign-up-btn sparkle-effect" onClick={handleSignUpClick}>
          Sign-up
        </button>
      </div>

      {/* Footer */}
      <footer className="landing-footer text-center">
        FOOTER @2024
      </footer>
    </div>
  );
};

export default LandingPage;
