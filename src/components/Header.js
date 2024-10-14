import React from 'react';
import { useNavigate } from 'react-router-dom';  
import logo from '../images/porthub_logo.png'

const Header = ({ screen }) => {
  const navigate = useNavigate();

  return (
    <div id="nav">
      <img src={logo} alt="Logo" id="logo" />
      <div id="topcontainer">
        <div id="innercon">
          {screen === 'template' ? (
            <>
              <h1 id="highlight">Templates</h1>
              <h1>Portfolio</h1>
            </>
          ) : screen === 'editportfolio' ? (
            <>
              <h1>Templates</h1>
              <h1 id="highlight">Portfolio</h1>
            </>
          ) : null}
        </div>
      </div>
      <div id="signoutcon">
        <button id="signoutbutton" onClick={() => navigate('/logout')}>Sign out</button>
      </div>
    </div>
  );
};

export default Header;