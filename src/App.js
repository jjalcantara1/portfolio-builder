import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Auth from './components/Auth';
import EditPortfolio from './screens/EditPortfolio';
import UserPortfolio from './screens/UserPortfolio';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/:username" element={<UserPortfolio />} />
          <Route path="/edit" element={<EditPortfolio />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
