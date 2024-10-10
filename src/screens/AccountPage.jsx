import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path to your firebase.js file
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, sendEmailVerification, updatePassword } from 'firebase/auth';
import '../css/AccountPage.css';
const AccountPage = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [fieldVisible, setFieldVisible] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(''); // Track verification status

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
      setVerificationStatus('Verification email sent to the new address.');
    }
  };

  const handleUpdateEmail = async () => {
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(currentEmail, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      
      // Update the email in Firebase Auth
      await updateEmail(user, newEmail);
      alert('Email updated successfully. A verification email has been sent to your new email address.');
      
      // Send verification email to the new email
      handleVerifyEmail(); // Send verification email immediately after updating
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Error updating email: ' + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    const user = auth.currentUser;

    if (newPassword === oldPassword) {
      alert('New password cannot be the same as the old password.');
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
    <div className="account-settings">
      <h2>Account Settings</h2>

      <p>Current Email: {currentEmail}</p>
      <p>Current Username: {currentUsername}</p>

     

      <button onClick={() => toggleField('username')}>Change Username</button>
      {fieldVisible === 'username' && (
        <div className="username-update">
          <input
            type="text"
            placeholder="New username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button onClick={handleUpdateUsername}>Update Username</button>
        </div>
      )}

      <button onClick={() => toggleField('password')}>Change Password</button>
      {fieldVisible === 'password' && (
        <div className="password-update">
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleUpdatePassword}>Update Password</button>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
