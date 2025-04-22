import React, { useState, useEffect } from 'react';
import './style.css';
import Winner from './Winner';
import UserProfile from './UserProfile';
import defaultAvatar from './assets/IMG_BDFA45B08A87-1.jpeg';

const JeopardyGameDemo = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Science' },
    { id: 2, name: 'History' },
    { id: 3, name: 'Geography' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Sports' }
  ]);

  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleNameSubmit = (index, name) => {
    setPlayers(prevPlayers => {
      const updated = [...prevPlayers];
      updated[index].name = name;
      return updated;
    });
  };

  const questionData = {
   'science-100': { text: 'This gas makes up about 78% of Earth\'s atmosphere', answer: 'What is Nitrogen?' },
    'science-200': { text: 'This element has the atomic number 79', answer: 'What is Gold?' },
    'history-100': { text: 'This document, signed in 1776, declared American independence from Great Britain', answer: 'What is the Declaration of Independence?' },
    'history-200': { text: 'This ancient wonder was a lighthouse built in Alexandria, Egypt', answer: 'What is the Lighthouse of Alexandria?' },
    'geography-100': { text: 'This is the largest ocean on Earth', answer: 'What is the Pacific Ocean?' },
    'geography-200': { text: 'This African country is home to the Nile River and the Pyramids of Giza', answer: 'What is Egypt?' },
    'entertainment-100': { text: 'This Disney movie features a lion cub named Simba', answer: 'What is The Lion King?' },
    'entertainment-200': { text: 'This actor played Iron Man in the Marvel Cinematic Universe', answer: 'Who is Robert Downey Jr.?' },
    'sports-100': { text: 'This sport uses a shuttlecock', answer: 'What is Badminton?' },
    'sports-200': { text: 'This athlete holds the record for most Olympic gold medals', answer: 'Who is Michael Phelps?' },
    'science-300': { text: 'This gas makes up about 78% of Earth\'s atmosphere', answer: 'What is Nitrogen?' },
    'science-400': { text: 'This element has the atomic number 79', answer: 'What is Gold?' },
    'science-500': { text: 'This element has the atomic number 79', answer: 'What is Gold?' },
    'history-300': { text: 'This document, signed in 1776, declared American independence from Great Britain', answer: 'What is the Declaration of Independence?' },
    'history-400': { text: 'This ancient wonder was a lighthouse built in Alexandria, Egypt', answer: 'What is the Lighthouse of Alexandria?' },
    'history-500': { text: 'This ancient wonder was a lighthouse built in Alexandria, Egypt', answer: 'What is the Lighthouse of Alexandria?' },
    'geography-300': { text: 'This is the largest ocean on Earth', answer: 'What is the Pacific Ocean?' },
    'geography-400': { text: 'This African country is home to the Nile River and the Pyramids of Giza', answer: 'What is Egypt?' },
    'geography-500': { text: 'This African country is home to the Nile River', answer: 'What is Egypt?' },
    'entertainment-300': { text: 'This Disney movie features a lion cub named Simba', answer: 'What is The Lion King?' },
    'entertainment-400': { text: 'This actor played Iron Man in the Marvel Cinematic Universe', answer: 'Who is Robert Downey Jr.?' },
    'entertainment-500': { text: 'This actor played Iron Man in the Marvel Cinematic Universe', answer: 'Who is Robert Downey Jr.?' },
    'sports-300': { text: 'This sport uses a shuttlecock', answer: 'What is Badminton?' },
    'sports-400': { text: 'This athlete holds the record for most Olympic gold medals', answer: 'Who is Michael Phelps?' },
    'sports-500': { text: 'This athlete holds the record for most Olympic gold medals', answer: 'Who is Michael Phelps?' }
  };

  const selectQuestion = (categoryId, difficultyLevel) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return setError('Invalid category');

    const categoryName = category.name.toLowerCase();
    const value = (difficultyLevel + 1) * 100;
    const questionKey = `${categoryId}-${difficultyLevel}`;
    const lookupKey = `${categoryName}-${value}`;

    if (revealedQuestions[questionKey]) return;

    setLoading(true);
    setTimeout(() => {
      const question = questionData[lookupKey];

      if (question) {
        setActiveQuestion({
          text: question.text,
          answer: question.answer,
          value,
          categoryId,
          key: questionKey
        });
        setShowAnswer(false);
      } else {
        setError(`No question found for ${categoryName} with value $${value}`);
        setTimeout(() => setError(null), 3000);
      }

      setLoading(false);
    }, 500);
  };

  const handleAnswerResult = (correct) => {
    if (activeQuestion) {
      const valueChange = correct ? activeQuestion.value : -activeQuestion.value;
      setPlayers(prevPlayers =>
        prevPlayers.map((p, i) =>
          i === currentPlayerIndex ? { ...p, score: p.score + valueChange } : p
        )
      );

      setRevealedQuestions(prev => {
        const updated = { ...prev, [activeQuestion.key]: true };
        const totalQuestions = categories.length * 5;
        if (Object.keys(updated).length === totalQuestions) {
          setGameCompleted(true);
        }
        return updated;
      });
    }

    setActiveQuestion(null);
    setShowAnswer(false);
    if (!correct) {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  const resetGame = () => {
    setRevealedQuestions({});
    setPlayers([
      { name: 'Player 1', score: 0 },
      { name: 'Player 2', score: 0 }
    ]);
    setCurrentPlayerIndex(0);
  };

  const addCategory = () => {
    if (!newCategoryInput.trim()) return;
    const isDuplicate = categories.some(cat => cat.name.toLowerCase() === newCategoryInput.toLowerCase());
    if (isDuplicate) return setError('Category already exists');

    setLoading(true);
    setTimeout(() => {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, name: newCategoryInput }]);
      setNewCategoryInput('');
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const totalQuestions = categories.length * 5;
    if (Object.keys(revealedQuestions).length === totalQuestions) {
      setGameCompleted(true);
    }
  }, [revealedQuestions]);

  const handlePlayAgain = () => {
    setGameCompleted(false);
    resetGame();
    setActiveQuestion(null);
    setShowAnswer(false);
  };

  if (gameCompleted) {
    return <Winner score={players.map(p => p.score)} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <>
      <div className="header">
        <div className="header-left">
          <h1>Jeopardy Style Game</h1>
        </div>
        <div className="header-center">
          <div className="player-info">
            {players.map((p, i) => (
              <div key={i} className={i === currentPlayerIndex ? 'current-player' : ''}>
                <h2>{p.name}</h2>
                <h3>Score: ${p.score}</h3>
              </div>
            ))}
          </div>
        </div>
        <div className="header-right">
          <button className="button" onClick={() => setShowUserProfile(true)}>User Profile</button>
          <button className="button" onClick={resetGame}>Reset Game</button>
        </div>
      </div>

      <div className="app-container">
        <div className="game-section">
          <div className="container">
            {error && <div className="error">{error}</div>}

            <div>
              <input
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="Add a new category"
              />
              <button className="button" onClick={addCategory} disabled={loading}>Submit</button>
            </div>

            {loading && <p>Loading...</p>}

            <table className="category-table">
              <thead>
                <tr>
                  {categories.map(category => (
                    <th key={category.id}>{category.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map(difficulty => (
                  <tr key={difficulty}>
                    {categories.map(category => {
                      const key = `${category.id}-${difficulty}`;
                      const value = (difficulty + 1) * 100;
                      const revealed = revealedQuestions[key];

                      return (
                        <td
                          key={key}
                          onClick={() => !revealed && !loading && selectQuestion(category.id, difficulty)}
                          className={revealed ? 'revealed' : ''}
                        >
                          {revealed ? '' : `$${value}`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {activeQuestion && (
              <div className="modal-overlay">
                <div className="question-modal">
                  <p><strong>Value:</strong> ${activeQuestion.value}</p>
                  <p>{activeQuestion.text}</p>
                  {!showAnswer ? (
                    <button className="button" onClick={() => setShowAnswer(true)}>Show Answer</button>
                  ) : (
                    <>
                      <p><strong>Answer:</strong> {activeQuestion.answer}</p>
                      <button className="button correct" onClick={() => handleAnswerResult(true)}>Correct</button>
                      <button className="button incorrect" onClick={() => handleAnswerResult(false)}>Incorrect</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showUserProfile && (
          <UserProfile
            players={players}
            onNameSubmit={handleNameSubmit}
            onClose={() => setShowUserProfile(false)}
          />
        )}

        <footer className="footer">
          This app was developed by Brogan, Ben, and Dee
        </footer>
      </div>
    </>
  );
};

export default JeopardyGameDemo;
