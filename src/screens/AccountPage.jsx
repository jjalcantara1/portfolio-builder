import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword } from 'firebase/auth';
import { FaUserEdit, FaLock, FaImage, FaCamera } from 'react-icons/fa'; // Import FaCamera icon
import '../css/AccountPage.css';

const AccountPage = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [fieldVisible, setFieldVisible] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentEmail(user.email);
          setCurrentUsername(data.username || '');
          setProfilePictureUrl(data.profilePictureUrl || '');
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchProfileData();
  }, [db]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePicture = async () => {
    const user = auth.currentUser;
    if (!user || !profilePicture) return;

    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadString(storageRef, profilePicture, 'data_url');
      const url = await getDownloadURL(storageRef);

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { profilePictureUrl: url });

      setProfilePictureUrl(url);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Error updating profile picture. Please try again.');
    }
  };

  const handleUpdateUsername = async () => {
    const user = auth.currentUser;
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { username: newUsername });
      setCurrentUsername(newUsername);
      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Error updating username: ' + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    const user = auth.currentUser;
    if (newPassword === oldPassword) {
      alert('New password cannot be the same as old password.');
      return;
    }
    const credential = EmailAuthProvider.credential(currentEmail, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password: ' + error.message);
    }
  };

  const toggleField = (field) => {
    setFieldVisible(fieldVisible === field ? '' : field);
  };

  return (
    <div className="acc-container">
      <h2 className="acc-header">Account Settings</h2>

      {/* Profile Picture Section */}
      <div className="acc-profile-picture-section">
        <label htmlFor="profile-upload" className="acc-profile-upload-label">
          {profilePictureUrl ? (
            <img className="acc-profile-picture" src={profilePictureUrl} alt="Profile" />
          ) : (
            <div className="acc-no-image">No Image</div>
          )}
          <FaCamera className="acc-camera-icon" />
        </label>
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <div className="acc-profile-picture-save">
          <button className="acc-button" onClick={handleSaveProfilePicture}>
            <FaImage /> Save Profile Picture
          </button>
        </div>
      </div>

      {/* Display current username and email */}
      <div className="acc-current-info">
        <p><strong>Current Username:</strong> {currentUsername}</p>
        <p><strong>Current Email:</strong> {currentEmail}</p>
      </div>

      {/* Change Username Section */}
      <button className="acc-button" onClick={() => toggleField('username')}>
        <FaUserEdit /> Change Username
      </button>
      {fieldVisible === 'username' && (
        <div className="acc-field-section">
          <input
            className="acc-input"
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button className="acc-button acc-save-btn" onClick={handleUpdateUsername}>
            Update Username
          </button>
        </div>
      )}

      {/* Change Password Section */}
      <button className="acc-button" onClick={() => toggleField('password')}>
        <FaLock /> Change Password
      </button>
      {fieldVisible === 'password' && (
        <div className="acc-field-section">
          <input
            className="acc-input"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="acc-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="acc-button acc-save-btn" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      )}
       <div className="acc-go-back-container">
        <button
          className="acc-go-back-button"
          onClick={() => window.location.href = '/template'}
          aria-label="Go back to templates"
        >
          Go Back to Templates
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
