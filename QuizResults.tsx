import { QuizResult, Difficulty } from '../types';

interface QuizResultsProps {
  results: QuizResult;
  onRestart: () => void;
}

export default function QuizResults({ results, onRestart }: QuizResultsProps) {
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! 🌟';
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 70) return 'Great job! 👍';
    if (percentage >= 60) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(results.percentage)}`}>
          {results.percentage.toFixed(1)}%
        </div>
        <p className="text-xl text-gray-600">{getScoreMessage(results.percentage)}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{results.correctAnswers}</div>
          <div className="text-sm text-gray-600">Correct Answers</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{results.totalQuestions}</div>
          <div className="text-sm text-gray-600">Total Questions</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">{results.duration}s</div>
          <div className="text-sm text-gray-600">Time Taken</div>
        </div>
      </div>

      {/* Difficulty Progression */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Difficulty Progression</h3>
        <div className="flex flex-wrap gap-2">
          {results.difficultyProgression.map((difficulty, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                difficulty
              )}`}
            >
              Q{index + 1}: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Question Review */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {results.questions.map((item, index) => (
            <div
              key={item.question.id}
              className={`border-2 rounded-lg p-4 ${
                item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-800">
                  Question {index + 1}: {item.question.text}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(
                    item.question.difficulty
                  )}`}
                >
                  {item.question.difficulty}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Your answer: </span>
                  <span
                    className={item.isCorrect ? 'text-green-700' : 'text-red-700'}
                  >
                    {item.userAnswer !== undefined
                      ? item.question.options[item.userAnswer]
                      : 'Not answered'}
                  </span>
                </div>
                {!item.isCorrect && (
                  <div>
                    <span className="font-medium">Correct answer: </span>
                    <span className="text-green-700">
                      {item.question.options[item.question.correctAnswer]}
                    </span>
                  </div>
                )}
                {item.question.explanation && (
                  <div className="text-gray-600 mt-2">
                    <strong>Explanation:</strong> {item.question.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Take Another Quiz
      </button>
    </div>
  );
}

