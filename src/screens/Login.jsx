import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import '../css/Login.css';
import logo from '../images/porthub_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate('/template'); // Redirect to template page if email is verified
      } else {
        setError('Please verify your email before logging in.');
      }
    } catch (error) {
      handleAuthError(error.code); // Handle custom error messaging
    }
  };

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        setError('No account found with this email.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      case 'auth/user-disabled':
        setError('This account has been disabled.');
        break;
      default:
        setError('Invalid username/password. Please try again.');
    }
  };

  return (
    <body id="login">
      <div>
        {/* Add onClick handler to navigate to landing page */}
        <button onClick={() => navigate('/')} style={{ border: 'none', backgroundColor: 'transparent', padding: 0, cursor: 'pointer' }}>
          <img src={logo} alt="Logo" id="logo" />
        </button>
      </div>
      <div id="logincon">
        <h1 id="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            id="loginemail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              id="loginpass"
              type={showPassword ? 'text' : 'password'} // Toggle input type based on state
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              style={{
                position: 'absolute',
                right: '15px',
                top: '1.25rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'rgb(255,217,90)',
                backgroundColor: 'transparent',
              }}
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" id="loginbutton">Login</button>
          <div id="buttoncon">
            <button type="button" id="registerlink" onClick={() => navigate('/register')}>
              Create an Account
            </button>
            <button type="button" id="forgotlink" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </body>
  );
};

export default Login;
