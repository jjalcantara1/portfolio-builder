import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

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
        navigate('/edit'); // Redirect to edit page if email is verified
      } else {
        setError('Please verify your email before logging in.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type based on state
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/register')}>
          Create an Account
        </button>
        <button type="button" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default Login;
