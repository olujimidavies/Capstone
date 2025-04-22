import React, { useState } from 'react';
import './style.css';
import defaultAvatar from './assets/blueicon.png';

const UserProfile = ({ players, onNameSubmit, onClose }) => {
  const [nameInputs, setNameInputs] = useState(players.map(p => p.name));

  const handleChange = (index, value) => {
    const updated = [...nameInputs];
    updated[index] = value;
    setNameInputs(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nameInputs.forEach((name, i) => {
      if (name.trim()) {
        onNameSubmit(i, name.trim());
      }
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <div className="profile-picture">
          <img src={defaultAvatar} alt="Profile" />
        </div>
        <form onSubmit={handleSubmit}>
          {nameInputs.map((name, i) => (
            <input
              key={i}
              type="text"
              value={name}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Enter name for Player ${i + 1}`}
              required
              className="profile-input"
            />
          ))}
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
