import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import '../css/Navbar.css'; // Assuming you're using an external stylesheet

const Navbar = () => {
  return (
<div className="top-navbar">
  <div className="navbar-center">
    <div className="button-container">
      <button className="navbar-button">Templates</button>
      <button className="navbar-button">Portfolio</button>
    </div>
  </div>
  <div className="signout-navbar">
    <button className="signout-button">Sign Out</button>
  </div>
</div>
);
};

export default Navbar;
