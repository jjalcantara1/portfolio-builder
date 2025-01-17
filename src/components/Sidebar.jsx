// Sidebar.js

import React from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPalette, faShapes } from "@fortawesome/free-solid-svg-icons";
import { faPalette, faShapes, faEyeSlash, faEye, faSave } from "@fortawesome/free-solid-svg-icons"; // Import icons

const Sidebar = ({
  activeSection,
  hoverSection,
  handleSectionClick,
  setHoverSection,
  toggleMainContent,
  isMainContentVisible,
  handleSave,
  profile,
}) => {
  return (
    <div className="sidebar-oblong">
      <Nav className="flex-column sidebar-nav">
        <Nav.Link
          href="#theme"
          className={`sidebar-link ${activeSection === "theme" ? "active" : ""} ${hoverSection === "theme" ? "hover" : ""}`}
          onClick={() => handleSectionClick("theme")}
          onMouseEnter={() => setHoverSection("theme")}
          onMouseLeave={() => setHoverSection("")}
        >
          <FontAwesomeIcon icon={faPalette} className="nav-icon" />
          <span className="nav-text">Theme</span>
        </Nav.Link>
        <Nav.Link
          href="#elements"
          className={`sidebar-link ${activeSection === "elements" ? "active" : ""} ${hoverSection === "elements" ? "hover" : ""}`}
          onClick={() => handleSectionClick("elements")}
          onMouseEnter={() => setHoverSection("elements")}
          onMouseLeave={() => setHoverSection("")}
        >
          <FontAwesomeIcon icon={faShapes} className="nav-icon" />
          <span className="nav-text">Elements</span>
        </Nav.Link>
      </Nav>
      <button
          onClick={toggleMainContent}
          className="toggle-button"
        >
          <FontAwesomeIcon icon={isMainContentVisible ? faEyeSlash : faEye} className="nav-icon" />
          <span className="nav-text">{isMainContentVisible ? "Hide Main Content" : "Show Main Content"}</span>
        </button>

        <button onClick={handleSave} className="save-button"> 
          <FontAwesomeIcon icon={faSave} className="nav-icon" />
          <span className="nav-text">Save Portfolio</span>
        </button>
        
      <div className="sidebar-footer">
        <div className="footer-icon">
          {profile.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt="Profile"
              className="footer-profile-image"
            />
          ) : (
            <div className="footer-image-placeholder">No Image</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
