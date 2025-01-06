"use client";

import { useEffect, useState } from "react";
import { data as allQuestions } from "../data.js";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [practiceAgain, setPracticeAgain] = useState(false);

  const [mode, setMode] = useState("random"); // "random" or "sequential"
  const [startQuestion, setStartQuestion] = useState(1);
  const [endQuestion, setEndQuestion] = useState(10);

  // Load questions based on the selected mode
  useEffect(() => {
    if (mode === "random") {
      const shuffledQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map((q) => ({
          ...q,
          choices: [...q.choices].sort(() => Math.random() - 0.5),
        }));
      setQuestions(shuffledQuestions);
    } else if (mode === "sequential") {
      if (startQuestion < 1 || startQuestion > allQuestions.length) {
        // console.log("Invalid start question number");
        setStartQuestion(1);
        setEndQuestion(10);
      }
      
      const filteredQuestions = allQuestions
        .slice(startQuestion - 1, endQuestion)
        .map((q) => ({
          ...q,
          choices: [...q.choices].sort(() => Math.random() - 0.5),
        }));
      setQuestions(filteredQuestions);
    }
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setQuestionsAnswered([]);
  }, [practiceAgain, mode, startQuestion, endQuestion]);

  const handleSelectAnswer = (choice) => {
    setAnswered(true);
    setSelectedAnswer(choice);
  };

  const handleCheckAnswer = () => {
    if (!checked && selectedAnswer !== null) {
      setChecked(true);
      const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
      if (isCorrect) {
        setCorrectCount(correctCount + 1);
      }
      setQuestionsAnswered([
        ...questionsAnswered,
        {
          question: questions[currentQuestionIndex].question,
          selectedAnswer,
          correctAnswer: questions[currentQuestionIndex].answer,
          isCorrect,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    setAnswered(false);
    setChecked(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePracticeAgain = () => {
    setAnswered(false);
    setChecked(false);
    setPracticeAgain(!practiceAgain);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
    return <div className="text-center text-lg">Loading questions...</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Quiz Complete!</h1>
        <p className="mb-4">You scored {correctCount} out of {questions.length}.</p>
        <ul className="space-y-4">
          {questionsAnswered.map((q, index) => (
            <li key={index} className="p-4 border rounded-md shadow-md">
              <strong>Q:</strong> {q.question}
              <br />
              Your Answer: {q.selectedAnswer} {q.isCorrect ? "✅" : "❌"}
              <br />
              Correct Answer: {q.correctAnswer}
            </li>
          ))}
        </ul>
        <button
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handlePracticeAgain}
        >
          Practice Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Mode Selection</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Mode:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="random">Random Questions</option>
            <option value="sequential">Sequential Questions</option>
          </select>
        </div>
        {mode === "sequential" && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Start Question:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={startQuestion}
              min={1}
              max={allQuestions.length}
              onChange={(e) => {
                if (e.target.value < 1 || e.target.value > allQuestions.length || e.target.value == null) {
                  // console.log("Invalid start question number");
                  
                  setStartQuestion(1);
                  setEndQuestion(10);
                }
                setStartQuestion(Number(e.target.value));
                console.log("startQuestion: ", startQuestion);
                
                setEndQuestion(Number(e.target.value) + 9);
              }}
            />
            {/* <label className="block font-semibold mb-2 mt-4">End Question:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={endQuestion}
              min={startQuestion}
              max={allQuestions.length}
              onChange={(e) => setEndQuestion(Number(e.target.value))}
            /> */}
            <br></br>
            <br></br>
            If you want to change the end question, please change the start question. 10 questions will be displayed from the start question.
            
          </div>
        )}
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
          onClick={handlePracticeAgain}
        >
          Start Quiz
        </button>
      </div>

      {/* Quiz Content */}
      <div className="flex flex-col items-center flex-1 p-8">
        <header className="w-full max-w-3xl mb-8">
          <h1 className="text-2xl font-bold text-center">Interactive MCQ Quiz</h1>
        </header>
        <main className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="mb-6">{currentQuestion.question}</p>
            <div className="space-y-4">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-full px-4 py-2 rounded-md text-left border ${
                    selectedAnswer === choice
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleSelectAnswer(choice)}
                  disabled={answered}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
          {checked && (
            <div className="w-full bg-gray-100 p-4 rounded-md shadow-md text-center mb-6">
              {selectedAnswer === currentQuestion.answer ? (
                <p className="text-green-600 font-semibold">Correct! 🎉</p>
              ) : (
                <>
                  <p className="text-red-600 font-semibold mb-2">Wrong! 😞</p>
                  {!showCorrectAnswer && (
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-md"
                      onClick={() => setShowCorrectAnswer(true)}
                    >
                      Show Correct Answer
                    </button>
                  )}
                  {showCorrectAnswer && (
                    <p className="mt-4">
                      Correct Answer: <strong>{currentQuestion.answer}</strong>
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          <div className="flex justify-between w-full">
            <button
              className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
                answered ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={checked ? handleNextQuestion : handleCheckAnswer}
            >
              {checked ? "Next" : "Check"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
