import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const restrictedUsernames = ['auth', 'edit', 'email-verification', 'logout', 'forgot-password', '']; // Include empty string

    if (restrictedUsernames.includes(username)) {
      setError('This username is not allowed.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      alert('A verification email has been sent. Please check your inbox and verify your email address.');
      navigate('/email-verification'); // Redirect to EmailVerification component after registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span
            onClick={() => setPasswordVisible(!passwordVisible)}
            style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: '1.2em' }} // Adjust font size
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <span
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: '1.2em'}} // Adjust font size
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
        <button type="button" onClick={() => navigate('/login')}>
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
