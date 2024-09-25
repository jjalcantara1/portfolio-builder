import React, { useEffect } from 'react';
import { auth } from '../firebase'; // Import your Firebase config
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        alert('You have been logged out successfully.');
        navigate('/login'); // Redirect to the home page or landing page after logout
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    };

    handleLogout();
  }, [navigate]);

  return <div>Logging you out...</div>; // Optional loading message
};

export default Logout;
