import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../css/ForgotPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetLinkSent(true);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResendLink = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Reset link resent. Please check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-icon">
        <FontAwesomeIcon icon={faLock} size="3x" style={{ color: '#ffdd57' }} />
        </div>
        <h2 className="forgot-password-title">Reset Your Password</h2>
        <p className="forgot-password-description">
          Please enter your email address, and we'll send you a link to reset your password.
        </p>
        <form className="forgot-password-form" onSubmit={handlePasswordReset}>
          <input
            className="forgot-password-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          {error && <p className="forgot-password-error">{error}</p>}
          <button className="forgot-password-button" type="submit">
            Send Reset Link
          </button>
          {resetLinkSent && (
            <p className="forgot-password-success">Reset link sent! Please check your inbox.</p>
          )}
        </form>
        <div className="forgot-password-actions">
          <button className="forgot-password-secondary-button" onClick={() => navigate('/login')}>
            Back to Login
          </button>
          <button
            className="forgot-password-create-button"
            onClick={() => navigate('/register')}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
