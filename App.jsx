import React, { useState } from 'react';

const JeopardyGameDemo = () => {
  // Sample data representing what would be fetched from your database
  const [categories, setCategories] = useState([
    { id: 1, name: 'Science' },
    { id: 2, name: 'History' },
    { id: 3, name: 'Geography' },
    { id: 4, name: 'Entertainment' },
    { id: 5, name: 'Sports' }
  ]);

  const [score, setScore] = useState(0);
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({
    categoryId: '',
    text: '',
    answer: '',
    value: 100
  });

  // Sample questions data by category and value
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
    'sports-200': { text: 'This athlete holds the record for most Olympic gold medals', answer: 'Who is Michael Phelps?' }
  };

  const selectQuestion = (categoryId, difficultyLevel) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name?.toLowerCase() || '';
    const value = (difficultyLevel + 1) * 100;
    const questionKey = `${categoryId}-${difficultyLevel}`;
    const lookupKey = `${categoryName}-${value}`;

    // Skip if already revealed
    if (revealedQuestions[questionKey]) return;

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const question = questionData[lookupKey];

      if (question) {
        setRevealedQuestions(prev => ({
          ...prev,
          [questionKey]: true
        }));

        setActiveQuestion({
          text: question.text,
          answer: question.answer,
          value: value,
          categoryId
        });
      } else {
        setError(`No question found for ${categoryName} with value $${value}`);
        setTimeout(() => setError(null), 3000);
      }

      setLoading(false);
    }, 500);
  };

  const handleAnswerResult = (correct) => {
    if (correct && activeQuestion) {
      setScore(prev => prev + activeQuestion.value);
    }
    setActiveQuestion(null);
  };

  const resetGame = () => {
    setRevealedQuestions({});
    setScore(0);
  };

  const addCategory = () => {
    if (!newCategoryInput.trim()) return;

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, name: newCategoryInput }]);
      setNewCategoryInput('');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-blue-900 text-white min-h-screen">
      <div className="bg-blue-950 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jeopardy Style Game</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddQuestion(!showAddQuestion)}
            className="hover:text-blue-300"
          >
            {showAddQuestion ? 'Hide Question Form' : 'Add Question'}
          </button>
          <a href="#" className="hover:text-blue-300">User Profile</a>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-600 p-3 my-4 rounded text-white">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-4 px-2 py-1 bg-red-700 rounded"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl">Player: Guest</h2>
            <h2 className="text-2xl font-bold">Score: ${score}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="New category name"
                className="p-2 bg-blue-800 border border-blue-600 rounded"
              />
              <button 
                onClick={addCategory}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              >
                Add Category
              </button>
            </div>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
            >
              Reset Game
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
            >
              Refresh Board
            </button>
          </div>
        </div>

        {showAddQuestion && (
          <div className="bg-blue-800 p-4 rounded mb-6">
            <h3 className="text-xl mb-4">Add New Question</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Category</label>
                <select
                  value={newQuestionData.categoryId}
                  onChange={(e) => setNewQuestionData({...newQuestionData, categoryId: e.target.value})}
                  className="w-full p-2 bg-blue-700 border border-blue-600 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Value</label>
                <select
                  value={newQuestionData.value}
                  onChange={(e) => setNewQuestionData({...newQuestionData, value: e.target.value})}
                  className="w-full p-2 bg-blue-700 border border-blue-600 rounded"
                >
                  <option value="100">$100</option>
                  <option value="200">$200</option>
                  <option value="300">$300</option>
                  <option value="400">$400</option>
                  <option value="500">$500</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2">Question Text</label>
                <textarea
                  value={newQuestionData.text}
                  onChange={(e) => setNewQuestionData({...newQuestionData, text: e.target.value})}
                  className="w-full p-2 bg-blue-700 border border-blue-600 rounded"
                  rows="2"
                  placeholder="What is..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2">Answer</label>
                <textarea
                  value={newQuestionData.answer}
                  onChange={(e) => setNewQuestionData({...newQuestionData, answer: e.target.value})}
                  className="w-full p-2 bg-blue-700 border border-blue-600 rounded"
                  rows="2"
                  placeholder="What is..."
                ></textarea>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              >
                Add Question
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center p-4">Loading...</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {categories.map(category => (
                  <th key={category.id} className="p-3 bg-blue-800 text-center border border-blue-600 text-lg font-bold">
                    {category.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map(difficultyLevel => (
                <tr key={difficultyLevel}>
                  {categories.map(category => {
                    const value = (difficultyLevel + 1) * 100;
                    const isRevealed = revealedQuestions[`${category.id}-${difficultyLevel}`];

                    return (
                      <td
                        key={`${category.id}-${difficultyLevel}`}
                        onClick={() => !isRevealed && !loading && selectQuestion(category.id, difficultyLevel)}
                        className={`p-4 text-center border border-blue-600 h-24 cursor-pointer 
                          ${isRevealed ? 'bg-blue-950 opacity-50' : 'bg-blue-700 hover:bg-blue-600'}`}
                      >
                        {isRevealed ? '' : `$${value}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-10">
            <div className="bg-blue-800 p-6 rounded-lg max-w-2xl w-full">
              <div className="text-xl mb-2">Value: ${activeQuestion.value}</div>
              <div className="text-2xl font-bold mb-6 p-4 bg-blue-700 rounded">
                {activeQuestion.text}
              </div>

              <div className="mb-4 p-4 bg-yellow-800 rounded">
                <h3 className="text-xl mb-2">Answer:</h3>
                <p className="text-xl">{activeQuestion.answer}</p>
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => handleAnswerResult(false)}
                  className="flex-1 bg-red-600 hover:bg-red-500 p-3 rounded text-lg"
                >
                  Incorrect
                </button>
                <button
                  onClick={() => handleAnswerResult(true)}
                  className="flex-1 bg-green-600 hover:bg-green-500 p-3 rounded text-lg"
                >
                  Correct
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 p-4 text-center bg-blue-950">
        This app was developed by Brogan, Ben, and Dee
      </footer>
    </div>
  );
};

export default JeopardyGameDemo;