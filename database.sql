CREATE TABLE game (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  category VARCHAR(255) NOT NULL, 
  question TEXT NOT NULL, 
  answer TEXT NOT NULL, 
  points INT NOT NULL
);

INSERT INTO game (category, question, answer, points) VALUES
('Science', 'What is the chemical symbol for gold?', 'Au', 100),
('Science', 'Formula for water', 'H2O', 200),
('Science', 'What planet is known as the Red Planet?', 'Mars', 300),
('Geography', 'What is the capital of France?', 'Paris', 100),
('Geography', 'Capital of Oklahoma?', 'Oklahoma City', 200),
('Geography', 'What continent is the United States on?', 'North America', 300),
('History', 'Who was the first president of the United States?', 'George Washington', 100),
('History', 'Who invented the light bulb?', 'Thomas Edison', 200),
('History', 'Who was the first Black U.S. president?', 'Barack Obama', 300),
('Math', 'What is 7 multiplied by 8?', '56', 100),
('Math', '1+1', '2', 200),
('Math', '2+2', '4', 300),
('Technology', 'What does CPU stand for?', 'Central Processing Unit', 100),
('Technology', 'Most used phone in the USA?', 'iPhone', 200),
('Technology', 'What does ALU mean?', 'Arithmetic Logic Unit', 300);

SELECT * FROM game;