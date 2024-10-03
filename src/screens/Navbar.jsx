import React, { useState, useEffect } from 'react';
import { Modal, Card, Button } from 'react-bootstrap'; // Import Card and Button
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom'; 
import '../css/Navbar.css';
import logo from '../images/porthub_logo.png';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const toggleModal = () => setShowModal((prev) => !prev);

  useEffect(() => {
    const fetchProfileData = () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfilePictureUrl(data.profilePictureUrl || '');
            setUsername(data.username || '');
          }
        });

        return () => unsubscribe();
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/logout');
    });
  };

  const handleViewPortfolio = () => {
    navigate(`/${username}`);
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
      <div className="nav-profile" onClick={toggleModal}>
        <span className="username">{username || 'Guest'}</span>
        <img src={profilePictureUrl} alt="Profile" className="profile-pic" />
        <Modal
          show={showModal}
          onHide={toggleModal}
          className="profile-modal"
          style={{
            position: 'absolute',
            top: '100px',  // Adjusted top position
            right: '10px', // Aligned to the right
            zIndex: '1050',
          }}
        >
          <Modal.Body>
            <Card className="profile-card">
              <Card.Body>
                <ul className="modal-options">
                  <li>
                    <Button 
                      variant="primary" 
                      className="w-100" 
                      onClick={() => navigate('/account')}>
                      Account Settings
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="primary" 
                      className="w-100" 
                      onClick={handleViewPortfolio}>
                      View Portfolio
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant="danger" 
                      className="w-100" 
                      onClick={handleLogout}>
                      Logout
                    </Button>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
