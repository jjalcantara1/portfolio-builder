// ForgotPassword.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false); // New state for tracking if the reset link was sent
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetLinkSent(true); // Mark that the reset link was sent
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
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Send Reset Link</button>
      </form>
      {resetLinkSent && (
        <div>
          <p>A password reset link has been sent to your email.</p>
          <button onClick={handleResendLink}>Resend Reset Link</button>
        </div>
      )}
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
};

export default ForgotPassword;
