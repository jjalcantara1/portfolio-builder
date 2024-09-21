import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Set a flag to check if the current location is the edit page
  const isEditPage = location.pathname.startsWith('/edit');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const username = user.email.split('@')[0];
        setUser({ ...user, username });

        // Only navigate if not already on the edit page
        if (!isEditPage) {
          navigate(`/${username}`);
        }
      } else {
        setUser(null);
        navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, [navigate, isEditPage]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
