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
  id: string;
  userId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Map<string, number>;
  currentDifficulty: Difficulty;
  score: number;
  startTime: Date;
  endTime?: Date;
}

export interface AnswerSubmission {
  questionId: string;
  answerIndex: number;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  duration: number;
  difficultyProgression: Difficulty[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
}

export interface UserScore {
  userId: string;
  username: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  completedAt: Date;
  sessionId: string;
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

