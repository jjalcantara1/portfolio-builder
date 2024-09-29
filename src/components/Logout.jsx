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

  return (
    <body id="spin">
      <div id="loadcon">
      <div className="spinner"></div>
      <p id="spinnertext">
          Logging you out...
        </p>
    </div>

    </body>
  ); // Optional loading message
};

export default Logout;
