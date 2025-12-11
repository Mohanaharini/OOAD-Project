import { useState, useEffect } from 'react';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import Login from './components/Login';
import Register from './components/Register';
import Leaderboard from './components/Leaderboard';
import { QuizSession, QuizResult, User } from './types';
import { authApi } from './services/api';

type AppState = 'auth' | 'login' | 'register' | 'start' | 'quiz' | 'results';
type AuthView = 'login' | 'register';

function App() {
  const [state, setState] = useState<AppState>('auth');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (authApi.isAuthenticated()) {
      const storedUser = authApi.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setState('start');
      } else {
        // Try to fetch user from API
        authApi.getCurrentUser()
          .then((userData) => {
            setUser(userData);
            setState('start');
          })
          .catch(() => {
            authApi.logout();
            setState('auth');
          });
      }
    }
  }, []);

  const handleLogin = () => {
    const storedUser = authApi.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setState('start');
    }
  };

  const handleRegister = () => {
    const storedUser = authApi.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setState('start');
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setSession(null);
    setResults(null);
    setState('auth');
    setAuthView('login');
  };

  const handleStartQuiz = (quizSession: QuizSession) => {
    setSession(quizSession);
    setState('quiz');
  };

  const handleQuizComplete = (quizResults: QuizResult) => {
    setResults(quizResults);
    setState('results');
    // Refresh user data to get updated stats
    authApi.getCurrentUser()
      .then(setUser)
      .catch(console.error);
  };

  const handleRestart = () => {
    setSession(null);
    setResults(null);
    setState('start');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                </div>
                <div className="text-left text-sm">
                  <p className="text-gray-600">Best: <span className="font-semibold text-primary-600">{user.bestScore}%</span></p>
                  <p className="text-gray-600">Avg: <span className="font-semibold text-primary-600">{user.averageScore.toFixed(1)}%</span></p>
                </div>
              </div>
            )}
            <div className="flex-1"></div>
            {user && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🧠 Adaptive Quiz System
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge with questions that adapt to your skill level
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {state === 'auth' && authView === 'login' && (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => setAuthView('register')}
            />
          )}

          {state === 'auth' && authView === 'register' && (
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}

          {state === 'start' && user && (
            <QuizStart onStart={handleStartQuiz} />
          )}

          {state === 'quiz' && session && (
            <QuizQuestion
              session={session}
              onComplete={handleQuizComplete}
              onUpdateSession={setSession}
            />
          )}

          {state === 'results' && results && (
            <QuizResults results={results} onRestart={handleRestart} />
          )}
        </main>

        {showLeaderboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative">
              <Leaderboard onClose={() => setShowLeaderboard(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
