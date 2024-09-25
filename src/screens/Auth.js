import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Handle registration logic
      const restrictedUsernames = ['auth', 'edit', 'email-verification', 'logout', 'forgot-password']; // Restricted usernames

      // Check if the username is restricted
      if (restrictedUsernames.includes(username)) {
        setError('This username is not allowed.');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        alert('Verification email sent. Please verify your email before logging in.');
        navigate('/email-verification'); // Navigate to email verification page
      } catch (error) {
        setError(error.message);
      }
    } else {
      // Handle login logic
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user.emailVerified) {
          navigate('/edit'); // Redirect to edit page if email is verified
        } else {
          setError('Please verify your email before logging in.');
          auth.signOut();
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {isRegister && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : 'Create an Account'}
        </button>
        <button type="button" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default Auth;
