import React, { useState, useEffect } from 'react';
import { Nav, Form, Button } from 'react-bootstrap';
import '../css/Portfolio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPalette, faShapes } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar'; // Import Navbar here
import { auth } from '../firebase'; // Ensure Firebase auth is imported
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const Portfolio = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    image: null,
    profilePictureUrl: '', // For storing image URL
    font: 'Arial', // Default font
    color: '#000000', // Default color
    links: [''], // Initialize links as an array
  });

  const [activeSection, setActiveSection] = useState(''); // Initially no active section
  const [hoverSection, setHoverSection] = useState(''); // Track which section is being hovered

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...docSnap.data(),
            links: docSnap.data().links || [''], // Ensure links are an array
          }));
        } else {
          console.log('No such document!');
        }
      }
    });

    return () => unsubscribe();
  }, [db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result; // This will give you the data URL of the file

        // Uploading the data URL to Firebase Storage
        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        await uploadString(storageRef, dataUrl, 'data_url'); // Ensure the data URL is in the correct format
        const url = await getDownloadURL(storageRef);

        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePictureUrl: url,
        }));
      };

      reader.readAsDataURL(file); // This will read the file as a data URL
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section); // Set the active section to be displayed
  };

  const determineDisplayedSection = () => {
    return hoverSection || activeSection;
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const handleAddLink = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      links: [...prevProfile.links, ''], // Add a new empty link
    }));
  };

  const handleLinkChange = (e, index) => {
    const newLinks = [...profile.links];
    newLinks[index] = e.target.value; // Update the link at the specified index
    setProfile((prevProfile) => ({
      ...prevProfile,
      links: newLinks,
    }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = profile.links.filter((_, i) => i !== index); // Remove link at specified index
    setProfile((prevProfile) => ({
      ...prevProfile,
      links: newLinks,
    }));
  };

  return (
    <div className="portfolio-container">
      <Navbar /> {/* Place Navbar here to display at the top of the Portfolio page */}

      {/* Sidebar */}
      <div className="sidebar-oblong">
        <Nav className="flex-column sidebar-nav">
          <Nav.Link
            href="#profile"
            className={`sidebar-link ${activeSection === 'profile' ? 'active' : ''} ${hoverSection === 'profile' ? 'hover' : ''}`}
            onClick={() => handleSectionClick('profile')}
            onMouseEnter={() => setHoverSection('profile')}
            onMouseLeave={() => setHoverSection('')}
          >
            <FontAwesomeIcon icon={faUser} className="nav-icon" />
            <span className="nav-text">Profile</span>
          </Nav.Link>
        </Nav>
        <div className="sidebar-footer">
          <div className="footer-icon">
            {profile.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="Profile" className="footer-profile-image" />
            ) : (
              <div className="footer-image-placeholder">No Image</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="left-content">
          {determineDisplayedSection() === 'profile' && (
            <div className="profile-content">
              <div className="edit-profile-section">
                <h3>Edit Profile</h3>
                <Form>
                  <Form.Group className="mb-3" controlId="profilePicture">
                    <Form.Label>Profile Picture:</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input-field"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profileName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profileAge">
                    <Form.Label>Age (optional):</Form.Label>
                    <Form.Control
                      type="text"
                      name="age"
                      value={profile.age}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profileBio">
                    <Form.Label>Bio:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profileFont">
                    <Form.Label>Font:</Form.Label>
                    <Form.Control
                      as="select"
                      name="font"
                      value={profile.font}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profileColor">
                    <Form.Label>Color:</Form.Label>
                    <Form.Control
                      type="color"
                      name="color"
                      value={profile.color}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </Form.Group>

                  <h3>Links</h3>
                  {profile.links.map((link, index) => (
                    <div key={index} className="link-input-container">
                      <Form.Control
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkChange(e, index)}
                        placeholder={`Link ${index + 1}`}
                        className="link-input"
                      />
                      <Button variant="danger" onClick={() => handleRemoveLink(index)} className="remove-link-button">Remove</Button>
                    </div>
                  ))}
                  <Button variant="secondary" onClick={handleAddLink} className="add-link-button">Add Link</Button>

                  <Button variant="primary" onClick={handleSave} className="save-button">Save Profile</Button>
                </Form>
              </div>
            </div>
          )}

          {determineDisplayedSection() === 'theme' && (
            <div className="theme-content">
              <h3>Theme Settings</h3>
              {/* Theme settings components go here */}
            </div>
          )}

          {determineDisplayedSection() === 'elements' && (
            <div className="elements-section">
              <h3>Elements</h3>
              <p>Manage your portfolio elements:</p>
              <div className="elements-options">
                <Button variant="success">Add Element</Button>
                <Button variant="danger" className="ml-2">Remove Element</Button>
              </div>
            </div>
          )}
        </div>
        

        <div className="user-info-section">
          {/* Render the user's portfolio based on the profile data */}
          <div className="user-info-card">
            <h2>{profile.name}'s Portfolio</h2>
            <div className="portfolio-image">
              {profile.profilePictureUrl ? (
                <img src={profile.profilePictureUrl} alt="Profile" className="portfolio-profile-image" />
              ) : (
                <div className="portfolio-image-placeholder">No Image</div>
              )}
            </div>
            <p className="portfolio-bio">{profile.bio}</p>
            <h3>Links:</h3>
            <ul className="portfolio-links">
              {profile.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link || 'Link Not Provided'}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;