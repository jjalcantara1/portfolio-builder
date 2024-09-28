import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import EditPortfolio from './screens/EditPortfolio';
import EmailVerification from './screens/EmailVerification';
import { AuthProvider } from './components/AuthContext';
import UserPortfolio from './screens/UserPortfolio';
import LandingPage from './screens/LandingPage';
import Logout from './components/Logout';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';


function App() {
  return (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit" element={<EditPortfolio />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/:username" element={<UserPortfolio />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
    </Router>
 
  );
}

export default App;
