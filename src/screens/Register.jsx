import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/Register.css';
import logo from '../images/porthub_logo.png';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const restrictedUsernames = [
      'auth', 'edit', 'email-verification',
      'logout', 'forgot-password', ''
    ];
    if (restrictedUsernames.includes(username)) {
      return 'This username is not allowed.';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long.';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, or dashes.';
    }
    return ''; // No error
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain a special character (!@#$%^&*).';
    }
    return ''; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);

    if (usernameValidation) {
      setUsernameError(usernameValidation);
      return;
    } else {
      setUsernameError('');
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: username });

      // Get Firestore instance
      const db = getFirestore();
      
      // Set user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        profilePictureUrl: '', // Set this as needed
        email: user.email, // Optionally store email
      });

      await sendEmailVerification(user);
      alert('A verification email has been sent. Please check your inbox and verify your email address.');
      navigate('/email-verification');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <body id="register">
      <div>
        {/* Wrap the logo in a button */}
        <button
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
        >
          <img src={logo} alt="Logo" id="logo" />
        </button>
      </div>
      <div id="registercon">
        <h1 id="title">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            id="registername"
            className={usernameError ? 'error-input' : ''}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            autoComplete="off"
          />
          {usernameError && (
            <p className="error-message">{usernameError}</p>
          )}

          <input
            id="registeremail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              id="regispass"
              className={passwordError ? 'error-input' : ''}
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '1.25rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'rgb(255,217,90)',
                backgroundColor: 'transparent',
              }}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && (
            <p className="error-message">{passwordError}</p>
          )}

          <div style={{ position: 'relative' }}>
            <input
              id="confirmpass"
              className={error ? 'error-input' : ''}
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <span
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '1.25rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'rgb(255,217,90)',
                backgroundColor: 'transparent',
              }}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && (
            <p className="error-message">{error}</p>
          )}

          <button type="submit" id="regisbutton">Register</button>

          <div id="buttoncon">
            <button
              type="button"
              id="loginlink"
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </body>
  );
};

export default Register;
