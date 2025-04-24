import React, { useState } from 'react';

const UserProfile = ({ players, onNameSubmit, onClose, setSinglePlayer, singlePlayer }) => {
  const [newNames, setNewNames] = useState(players.map(p => p.name));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    newNames.forEach((name, index) => {
      if (name.trim() && index < players.length) {
        onNameSubmit(index, name);
      }
    });
    onClose();
  };

  const handleNameChange = (index, value) => {
    const updated = [...newNames];
    updated[index] = value;
    setNewNames(updated);
  };

  const handleSinglePlayerToggle = (e) => {
    const isChecked = e.target.checked;
    setSinglePlayer(isChecked);
  };

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <h2>Player Profiles</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="single-player-toggle">
            <label htmlFor="profile-single-player">Single Player Mode</label>
            <input 
              type="checkbox" 
              id="profile-single-player"
              checked={singlePlayer}
              onChange={handleSinglePlayerToggle}
            />
          </div>
          
          {/* Always show Player 1 */}
          <div className="profile-input-group">
            <label>Player 1 Name:</label>
            <input
              type="text"
              className="profile-input"
              value={newNames[0] || ''}
              onChange={(e) => handleNameChange(0, e.target.value)}
              placeholder="Enter name"
            />
          </div>
          
          {/* Only show Player 2 in multiplayer mode */}
          {!singlePlayer && (
            <div className="profile-input-group">
              <label>Player 2 Name:</label>
              <input
                type="text"
                className="profile-input"
                value={newNames[1] || ''}
                onChange={(e) => handleNameChange(1, e.target.value)}
                placeholder="Enter name"
              />
            </div>
          )}
          
          <div className="profile-buttons">
            <button type="submit" className="button">Save</button>
            <button type="button" className="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;