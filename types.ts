export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  category?: string;
  explanation?: string;
}

export interface QuizSession {
  sessionId: string;
  question: Question;
  totalQuestions: number;
  currentQuestion: number;
}

export interface AnswerResponse {
  isCorrect: boolean;
  nextQuestion?: Question;
  isComplete: boolean;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  currentDifficulty: Difficulty;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  duration: number;
  difficultyProgression: Difficulty[];
  questions: Array<{
    question: Question;
    userAnswer: number | undefined;
    isCorrect: boolean;
  }>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  bestScore: number;
  averageScore: number;
  totalQuizzes: number;
  recentScores: number[];
}

