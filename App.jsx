import React, { useState } from 'react';
import './App.css';

function App() {
  const [textValue, setTextValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const submitData = () => {
    fetch("http://0.0.0.0:3000/api/submit", { // Use '0.0.0.0' instead of 'localhost' for external access
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textValue })
    })
    .then(response => response.json())
    .then(data => {
      setResponseMessage(data.message);
      setTextValue('');
    })
    .catch(error => console.error("Error:", error));
  };

  return (
    <div>
      <div className="navbar">
        <h1>Jeopardy Style Game</h1>
        <div>
          <a href="#">Menu</a>
        
          <a href="#">User Profile</a>
        </div>
      </div>
      <div className="container">
        <h1>Please enter Your text:</h1>
        <div className="form-box">
          <input 
            type="text" 
            value={textValue} 
            onChange={(e) => setTextValue(e.target.value)} 
            placeholder="Type something here............." 
            required 
          />
          <button onClick={submitData}>Submit!</button>

          <button onClick={submitData}>Play as Guest </button>
          <button onClick={submitData}>Sign up</button>
        </div>
        <p>{responseMessage}</p>
      </div>


  <footer> This app </footer>
    </div>
  );
}

export default App;