import React from 'react';
import './style.css';

const Winner = ({ score, onPlayAgain }) => {
  return (
    <div className="winner-container">
      <div className="winner-content">
        <h1>🎉 Congratulations! 🎉</h1>
        <h2>You've won the game!</h2>
        <div className="final-score">
          <h3>Final Score:</h3>
          <h2>${score}</h2>
        </div>
        <button className="button play-again" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Winner; 