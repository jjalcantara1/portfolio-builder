import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase'; // Adjust the path to your firebase.js file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Navbar.css';
import logo from '../images/porthub_logo.png';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Use useNavigate for navigation

  const toggleModal = () => setShowModal((prev) => !prev); // Toggle modal visibility

  useEffect(() => {
    const fetchProfileData = () => {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid);

        // Set up a real-time listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Fetched data:', data); // Log fetched data
            setProfilePictureUrl(data.profilePictureUrl || ''); // Set profile picture URL
            setUsername(data.username || ''); // Set username

            // Debugging: Check if username is set correctly
            console.log('Username set to:', data.username || '');
          } else {
            console.log('No such document!');
          }
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
      } else {
        console.log('No user is currently logged in.'); // Debugging
      }
    };

    fetchProfileData(); // Fetch profile data when the component mounts
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/logout'); // Redirect to /logout after signing out
    });
  };

  const handleViewPortfolio = () => {
    navigate(`/${username}`); // Navigate to /:username
  };

  return (
    <div className="top-navbar">
      <div className="navbar-center">
        <div className="logo-container">
          <img src={logo} alt="Logo" id="logo" />
        </div>
        <div className="button-container">
          <button className="navbar-button">Templates</button>
          <button className="navbar-button">Portfolio</button>
        </div>
      </div>
      <div className="nav-profile" onClick={toggleModal} style={{ position: 'relative', cursor: 'pointer' }}>
        <span className="username">{username ? username : 'Guest'}</span>
        <img src={profilePictureUrl} alt="Profile" className="profile-pic" />
        <Modal
          show={showModal}
          onHide={toggleModal}
          className="profile-modal"
          style={{
            position: 'absolute',
            top: '60%', // Adjust to position below the profile section
            right: '0',
            zIndex: '1050',
            width: '250px', // Set a width for the modal
          }}
        >
       
          <Modal.Body>
            <ul className="modal-options">
              <li><button onClick={handleViewPortfolio}>View Portfolio</button></li>
              <li><button onClick={handleLogout}>Logout</button></li>
              <li><button onClick={toggleModal}>Change Password</button></li>
              <li><button onClick={toggleModal}>Change Email</button></li>
            </ul>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
