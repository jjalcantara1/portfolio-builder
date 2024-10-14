import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import EditPortfolio from './screens/EditPortfolio';
import EmailVerification from './screens/EmailVerification';
import { AuthProvider } from './components/AuthContext';
import UserPortfolio from './screens/UserPortfolio';
import LandingPage from './screens/LandingPage';
import Logout from './components/Logout';
import ForgotPassword from './screens/ForgotPassword';
import Portfolio from './screens/Portfolio';
import TemplateScreen from './screens/TemplateScreen';
import ProtectedRoute from './components/ProtectedRoutes';  // Import ProtectedRoute
import AccountPage from './screens/AccountPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from './screens/Profile';

function App() {

  // Check if username exists in your database (this is just a placeholder for your actual logic)
  const isValidUsername = (username) => {
    // Implement actual check against the database or your user list
    const validUsernames = ['user1', 'user2']; // Replace with actual logic
    return validUsernames.includes(username);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/portfolio"element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:templateId" 
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/logout" 
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/template" 
            element={
              <ProtectedRoute>
                <TemplateScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountPage/>
            </ProtectedRoute>
          } 
        />
          {/* User Portfolio Route with Username Validation */}
          <Route path="/:username" element={<UserPortfolio/>}  />
          
          {/* Catch-all for invalid routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
