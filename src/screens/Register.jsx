import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import '../css/Register.css';
import logo from '../images/porthub_logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  // Validate the username based on length and allowed characters
  const validateUsername = (username) => {
    const restrictedUsernames = ['auth', 'edit', 'email-verification', 'logout', 'forgot-password', '']; // Restricted usernames
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

  // Validate the password based on length and complexity
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
      return 'Password must contain at least one special character (!@#$%^&*).';
    }
    return ''; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate username and password
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
      
      await updateProfile(user, {
        displayName: username,  // Set the displayName to the username
      });

      await sendEmailVerification(user);

      alert('A verification email has been sent. Please check your inbox and verify your email address.');
      navigate('/email-verification'); // Redirect to EmailVerification component after registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <body id="register">
      <div>
        <img src={logo} alt="Logo" id="logo" />
      </div>
      <div id="registercon">
        <h1 id="title">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            id="registername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            autoComplete="off" 
          />
          {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
          
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
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

          <div style={{ position: 'relative' }}>
            <input
              id="confirmpass"
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button type="submit" id="regisbutton">Register</button>
          
          <div id="buttoncon">
            <button type="button" id="loginlink" onClick={() => navigate('/login')}>
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </body>
  );
};

export default Register;
