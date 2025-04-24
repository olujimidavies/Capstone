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
  const [singlePlayer, setSinglePlayer] = useState(false);
  const OPENAI_API_KEY = ""; // replace this


  useEffect(() => {
    if (singlePlayer) {
      setPlayers([{ name: 'Player 1', score: 0 }]);
    } else {
      setPlayers([
        { name: 'Player 1', score: 0 },
        { name: 'Player 2', score: 0 }
      ]);
    }
    setCurrentPlayerIndex(0);
  }, [singlePlayer]);

  const handleNameSubmit = (index, name) => {
    setPlayers(prev => {
      const updated = [...prev];
      if (updated[index]) updated[index].name = name;
      return updated;
    });
  };

  const generateAndSendQuestions = async () => {
    if (!newCategoryInput.trim()) return;
    setLoading(true);
    const random4Digit = Math.floor(Math.random() * 9000) + 1000;
    console.log(random4Digit);

    const prompt = `I need you to populate a Jeopardy board with questions for my web app. The backend will process your response into Question objects. It is expecting JSON in the form of [{ 
        "gameId": , 
        "questionId": , 
        "category": "", 
        "question": "",
        "answer": "", 
        "points":
    } 
...
]
Generate 5 categories with 5 questions each for a total of exactly 25 questions. The response should be in raw text form. Do not insert spaces or escape characters. Give ONLY the JSON in string format. In this case use gameId = ${random4Digit}. The point values should be from 100 to 500 based on difficulty in each category. Try to make answers one word or short phrases, and make them as unambiguous as possible. Give the response in a single line. Generate the questions based on the following content:\n\n${newCategoryInput}`;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2
        })
      });
  
      const data = await response.json();
      let jsonString = data.choices[0].message.content;
      jsonString = String(jsonString);
      if (jsonString.startsWith("\"") && jsonString.endsWith("\"")) {
        jsonString = jsonString.substring(1, jsonString.length - 1);
      }
      console.log("Generated OpenAI JSON string:", jsonString);
  
      await fetch('/api/jeopardy/createquestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSet: jsonString // DO NOT parse it
        })
      });
      
  
      //const resultText = await backendRes.text();
      //console.log('Backend response:', resultText);
      setNewCategoryInput('');
    } 
    catch (error) {
      console.error("OpenAI/API error:", error);
      alert("Failed to generate or send questions.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const selectQuestion = (categoryId, difficultyLevel) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return setError('Invalid category');

    const value = (difficultyLevel + 1) * 100;
    const questionKey = `${categoryId}-${difficultyLevel}`;
    const lookupKey = `${category.name.toLowerCase()}-${value}`;

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
        setError(`No question found for ${category.name} $${value}`);
        setTimeout(() => setError(null), 3000);
      }
      setLoading(false);
    }, 500);
  };

  const handleAnswerResult = (correct) => {
    if (activeQuestion) {
      const delta = correct ? activeQuestion.value : -activeQuestion.value;
      setPlayers(prev =>
        prev.map((p, i) =>
          i === currentPlayerIndex ? { ...p, score: p.score + delta } : p
        )
      );
      setRevealedQuestions(prev => ({ ...prev, [activeQuestion.key]: true }));
    }
    setActiveQuestion(null);
    setShowAnswer(false);
    if (!singlePlayer && !correct) {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  const resetGame = () => {
    setRevealedQuestions({});
    setPlayers(singlePlayer
      ? [{ name: 'Player 1', score: 0 }]
      : [
          { name: 'Player 1', score: 0 },
          { name: 'Player 2', score: 0 }
        ]);
    setCurrentPlayerIndex(0);
  };

  useEffect(() => {
    const total = categories.length * 5;
    if (Object.keys(revealedQuestions).length === total) {
      setGameCompleted(true);
    }
  }, [revealedQuestions, categories.length]);

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
            <div className="single-player-toggle">
              <label htmlFor="single-player-checkbox">Single Player Mode</label>
              <input 
                type="checkbox" 
                id="single-player-checkbox"
                checked={singlePlayer}
                onChange={(e) => setSinglePlayer(e.target.checked)}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div>
            <input
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Paste your lesson content here"
            />
            <button className="button" onClick={generateAndSendQuestions} disabled={loading}>
                Generate AI Questions</button>
            </div> 
             {/* do not need just for testing */}

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
            setSinglePlayer={setSinglePlayer}
            singlePlayer={singlePlayer}
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
