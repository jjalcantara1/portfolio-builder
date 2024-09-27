import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/AuthContext.css';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  // Set a flag to check if the current location is the edit page or any protected page
  const isProtectedRoute = location.pathname.startsWith('/edit');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const username = user.email.split('@')[0];
        setUser({ ...user, username });
      } else {
        setUser(null);

        // Only redirect if on a protected route
        if (isProtectedRoute) {
          navigate('/login');
        }
      }
      setLoading(false); // Once the user state is resolved, stop loading
    });

    return () => unsubscribe();
  }, [navigate, isProtectedRoute]);

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading while checking user state
  // }

  if (loading) {
    return (
      <body id="spin">
        <div id="loadcon">
        <div className="spinner"></div>
      </div>
      </body>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
