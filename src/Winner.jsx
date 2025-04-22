import React from 'react';
import './style.css';

const Winner = ({ score, onPlayAgain }) => {
  const highestScore = Math.max(...score);
  const winners = score
    .map((s, i) => (s === highestScore ? `Player ${i + 1}` : null))
    .filter(Boolean);

  return (
    <div className="winner-container">
      <div className="winner-content">
        {highestScore <= 0 ? (
          <>
            <h1>😢 No Winners 😢</h1>
            <h2>Everyone scored too low. Try again!</h2>
          </>
        ) : (
          <>
            <h1>🎉 {winners.join(' & ')} Wins! 🎉</h1>
            <h2>Great job on winning Jeopardy!</h2>
          </>
        )}
        <div className="final-score">
          <h3>Final Scores:</h3>
          {score.map((s, i) => (
            <h2 key={i}>Player {i + 1}: ${s}</h2>
          ))}
        </div>
        <button className="button play-again" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Winner;