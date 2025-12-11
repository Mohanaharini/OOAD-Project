import { useState, useEffect } from 'react';
import { quizApi } from '../services/api';
import { QuizSession, AnswerResponse, QuizResult, Difficulty } from '../types';

interface QuizQuestionProps {
  session: QuizSession;
  onComplete: (results: QuizResult) => void;
  onUpdateSession: (session: QuizSession) => void;
}

export default function QuizQuestion({
  session,
  onComplete,
  onUpdateSession,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession>(session);

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    setLoading(true);
    setSubmitted(true);

    try {
      const response: AnswerResponse = await quizApi.submitAnswer(
        currentSession.sessionId,
        currentSession.question.id,
        selectedAnswer
      );

      setFeedback({
        isCorrect: response.isCorrect,
        message: response.isCorrect
          ? '🎉 Correct! Great job!'
          : '❌ Incorrect. Keep learning!',
      });

      if (response.isComplete) {
        // Quiz is complete, get results
        setTimeout(async () => {
          const results = await quizApi.getResults(currentSession.sessionId);
          onComplete(results);
        }, 2000);
      } else if (response.nextQuestion) {
        // Update session with next question
        setTimeout(() => {
          const updatedSession: QuizSession = {
            ...currentSession,
            question: response.nextQuestion!,
            currentQuestion: response.currentQuestion,
          };
          setCurrentSession(updatedSession);
          onUpdateSession(updatedSession);
          setSelectedAnswer(null);
          setSubmitted(false);
          setFeedback(null);
        }, 2000);
      }
    } catch (error: any) {
      setFeedback({
        isCorrect: false,
        message: error.response?.data?.error || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-100 text-green-800';
      case Difficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case Difficulty.HARD:
        return 'bg-red-100 text-red-800';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentSession.currentQuestion} of {currentSession.totalQuestions}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
              currentSession.question.difficulty
            )}`}
          >
            {getDifficultyLabel(currentSession.question.difficulty)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(currentSession.currentQuestion / currentSession.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentSession.question.text}
        </h2>

        {currentSession.question.category && (
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mb-4">
            {currentSession.question.category}
          </span>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentSession.question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentSession.question.correctAnswer;
            const showCorrect = submitted && isCorrect;
            const showIncorrect = submitted && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !submitted && setSelectedAnswer(index)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                } ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showIncorrect
                    ? 'border-red-500 bg-red-50'
                    : ''
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-3 ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    } ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showIncorrect
                        ? 'bg-red-500 text-white'
                        : ''
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800">{option}</span>
                  {showCorrect && <span className="ml-auto text-green-600">✓</span>}
                  {showIncorrect && <span className="ml-auto text-red-600">✗</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`font-semibold ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {feedback.message}
          </p>
          {currentSession.question.explanation && (
            <p className="text-sm text-gray-700 mt-2">
              <strong>Explanation:</strong> {currentSession.question.explanation}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedAnswer === null || submitted || loading}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Processing...' : submitted ? 'Next Question...' : 'Submit Answer'}
      </button>
    </div>
  );
}

