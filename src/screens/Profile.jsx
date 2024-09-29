import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import '../css/Profile.css';
import { onAuthStateChanged } from 'firebase/auth';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    bio: '',
    font: '',
    color: '',
    links: [],
    profilePicture: null,
    profilePictureUrl: '', // URL to store preview
  });

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    });

    return () => unsubscribe();
  }, [db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAddLink = () => {
    setUserData({
      ...userData,
      links: [...userData.links, ''],
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUserData((prevUserData) => ({
        ...prevUserData,
        profilePicture: file, // Save the file for uploading later
        profilePictureUrl: previewUrl, // Show the image immediately
      }));
    }
  };

  const handleRemovePicture = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Clear the profile picture in the state
    setUserData({
      ...userData,
      profilePicture: null,
      profilePictureUrl: '', // Clear the URL as well
    });

    // Update Firestore to remove the profile picture URL
    try {
      const userProfileData = {
        ...userData,
        profilePictureUrl: '', // Clear the URL
      };
      await setDoc(doc(db, 'users', user.uid), userProfileData);
      console.log('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing profile picture:', error);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Prepare user profile data
      const userProfileData = {
        name: userData.name,
        age: userData.age,
        bio: userData.bio,
        font: userData.font,
        color: userData.color,
        links: userData.links,
      };

      // If there's a profile picture, upload it to Firebase Storage
      if (userData.profilePicture) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        const reader = new FileReader();

        reader.onload = async () => {
          const base64Image = reader.result;
          console.log('Uploading image:', base64Image);
          await uploadString(storageRef, base64Image, 'data_url');
          console.log('Profile picture uploaded successfully!');

          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);
          console.log('Download URL:', downloadURL); // Log the download URL

          // Update user profile data with the download URL
          userProfileData.profilePictureUrl = downloadURL;

          // Save user profile data to Firestore
          await setDoc(doc(db, 'users', user.uid), userProfileData);
          console.log('User profile data saved:', userProfileData);
        };

        reader.readAsDataURL(userData.profilePicture);
        await new Promise((resolve) => {
          reader.onloadend = resolve; // Resolve when the read is complete
        });
      } else {
        // Save user profile data without profile picture
        await setDoc(doc(db, 'users', user.uid), userProfileData);
        console.log('User profile data saved without picture:', userProfileData);
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Profile</h2>

        {/* Image Picker Section */}
        <div className="image-picker">
          <label htmlFor="profilePictureInput" className="profile-picture-label">
            Choose a Picture
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {userData.profilePictureUrl && (
            <div className="profile-picture">
              <img
                src={userData.profilePictureUrl}
                alt="Profile"
                className="profile-preview-image"
              />
            </div>
          )}
          <button onClick={handleRemovePicture} className="profile-picture-button">
            Remove
          </button>
        </div>

        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Age:
          <input
            type="text"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            placeholder="Optional"
          />
        </label>
        <label>
          Bio:
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
          />
        </label>

        <h3>Fonts</h3>
        <label>
          Font:
          <input
            type="text"
            name="font"
            value={userData.font}
            onChange={handleInputChange}
          />
        </label>

        <h3>Colors</h3>
        <label>
          Color:
          <input
            type="text"
            name="color"
            value={userData.color}
            onChange={handleInputChange}
          />
        </label>

        <h3>Links</h3>
        {userData.links.map((link, index) => (
          <input
            key={index}
            type="text"
            value={link}
            onChange={(e) => {
              const newLinks = [...userData.links];
              newLinks[index] = e.target.value;
              setUserData({ ...userData, links: newLinks });
            }}
          />
        ))}
        <button onClick={handleAddLink}>+ Add link</button>

        {/* Save Button */}
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>

      <div className="profile-preview">
        <h3>Preview</h3>
        <div className="preview-box">
          <div className="profile-picture">
            {userData.profilePictureUrl && (
              <img
                src={userData.profilePictureUrl}
                alt="Profile Preview"
                className="profile-preview-image"
              />
            )}
          </div>
          <p>Name: {userData.name}</p>
          <p>Age: {userData.age}</p>
          <p>Bio: {userData.bio}</p>
          <p>Links: {userData.links.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
