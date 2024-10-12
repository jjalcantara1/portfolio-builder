import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentEmail(user.email);
          setCurrentUsername(data.username || '');
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchProfileData();
  }, []);

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
      alert('Email updated successfully. Verification email sent to new email.');
      handleVerifyEmail();
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
      const db = getFirestore();
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
    <div className="acc-container">
      <h2 className="acch2">Account Settings</h2>

      <div className="acc-info">
        <FaEnvelope className="acc-icon" />
        <p>Current Email: {currentEmail}</p>
      </div>
      <div className="acc-info">
        <FaUserEdit className="acc-icon" />
        <p>Current Username: {currentUsername}</p>
      </div>

      {verificationStatus && (
        <div className="acc-status-badge">
          {verificationStatus}
        </div>
      )}

      <button className="acc-btn" onClick={() => toggleField('username')}>
        <FaUserEdit className="acc-btn-icon" /> Change Username
      </button>
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
