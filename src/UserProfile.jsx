import React, { useState } from 'react';
import './style.css';
import defaultAvatar from './assets/IMG_BDFA45B08A87-1.jpeg';
import maleAvatar from './assets/IMG_FE626370AAF6-1.jpeg';
import femaleAvatar from './assets/IMG_9499.jpg';

const UserProfile = ({ userName, onNameSubmit, onClose }) => {
  const [nameInput, setNameInput] = useState(userName || '');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim() && gender) {
      onNameSubmit(nameInput.trim(), gender);
      onClose();
    }
  };

  const getProfilePicture = () => {
    if (gender === 'male') {
      return maleAvatar;
    } else if (gender === 'female') {
      return femaleAvatar;
    }
    return defaultAvatar;
  };

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <div className="profile-picture">
          <img src={getProfilePicture()} alt="Profile" />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
            required
            className="profile-input"
          />
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              Female
            </label>
          </div>
          <div className="profile-buttons">
            <button type="submit" className="button">Save</button>
            <button type="button" className="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile; 