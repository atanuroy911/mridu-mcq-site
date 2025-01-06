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

  // Load random questions and randomize options
  useEffect(() => {
    const shuffledQuestions = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((q) => ({
        ...q,
        choices: [...q.choices].sort(() => Math.random() - 0.5), // Randomize choices
      }));
    setQuestions(shuffledQuestions);
  }, [practiceAgain]);

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
    setPracticeAgain(!practiceAgain);
    setCorrectCount(0);
    setCurrentQuestionIndex(0);
    setQuestionsAnswered([]);
  };

  if (questions.length === 0) {
    return <div className="text-center text-lg">Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

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
    <div className="flex flex-col items-center min-h-screen p-8">
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
  );
}
