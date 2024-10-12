import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, sendEmailVerification, updatePassword } from 'firebase/auth';
import { FaUserEdit, FaEnvelope, FaLock, FaKey } from 'react-icons/fa'; // Import icons
import '../css/AccountPage.css';

const AccountPage = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [fieldVisible, setFieldVisible] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State for selected profile picture
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // State for profile picture URL
  const [verificationStatus, setVerificationStatus] = useState(''); // Track verification status

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
          setProfilePictureUrl(data.profilePictureUrl || ''); // Set the profile picture URL
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
        setProfilePicture(reader.result); // Store the data URL of the selected image
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
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

  const handleVerifyEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      alert('Verification email sent. Please check your inbox for the new email.');
      setVerificationStatus('Verification email sent.');
    }
  };

  const handleUpdateEmail = async () => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(currentEmail, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      alert('Email updated successfully. A verification email has been sent to your new email address.');
      handleVerifyEmail(); // Send verification email immediately after updating
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Error updating email: ' + error.message);
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

  const handleUpdateUsername = async () => {
    const user = auth.currentUser;
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { username: newUsername });
      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Error updating username: ' + error.message);
    }
  };

  const toggleField = (field) => {
    setFieldVisible(fieldVisible === field ? '' : field);
  };

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>
      <div className="profile-picture-section">
        <h3>Profile Picture</h3>
        <div className="profile-picture-container">
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt="Profile" className="profile-image" />
          ) : (
            <div className="image-placeholder">No Image</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {profilePicture && (
          <button onClick={handleSaveProfilePicture}>Save Profile Picture</button>
        )}
      </div>

      <p>Current Email: {currentEmail}</p>
      <p>Current Username: {currentUsername}</p>

      <button onClick={() => toggleField('username')}>Change Username</button>
      {fieldVisible === 'username' && (
        <div className="username-update acc-update">
          <input
            type="text"
            placeholder="New username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="acc-input"
          />
          <button className="acc-btn" onClick={handleUpdateUsername}>
            Update Username
          </button>
        </div>
      )}

      <button className="acc-btn" onClick={() => toggleField('password')}>
        <FaLock className="acc-btn-icon" /> Change Password
      </button>
      {fieldVisible === 'password' && (
        <div className="password-update acc-update">
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="acc-input"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="acc-input"
          />
          <button className="acc-btn" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
