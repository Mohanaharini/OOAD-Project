# 🧠 Adaptive Quiz System

A modern, full-stack adaptive quiz application that adjusts question difficulty based on user performance. Built with React, TypeScript, Express, and Node.js.

## ✨ Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Adaptive Difficulty**: Questions automatically adjust based on your performance
  - Answer correctly → Get harder questions
  - Answer incorrectly → Get easier questions
- **Leaderboard**: Compete with other users and track rankings
  - View top scores by best score or average score
  - See your rank and recent performance
- **Real-time Feedback**: Instant feedback after each answer with explanations
- **Progress Tracking**: Visual progress bar and difficulty indicators
- **User Profiles**: Track your best score, average score, and total quizzes completed
- **Detailed Results**: Comprehensive quiz results with question review
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript support for both frontend and backend

## 🏗️ Project Structure

```
maha/
├── backend/          # Express API server
│   ├── src/
│   │   ├── data/     # Question database
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic (adaptive algorithm)
│   │   └── types.ts  # TypeScript types
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── types.ts     # TypeScript types
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📚 API Endpoints

### Authentication

#### `POST /api/auth/register`
Register a new user.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### `POST /api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### `GET /api/auth/me`
Get current user profile (requires authentication).

### Quiz

#### `POST /api/quiz/start`
Start a new quiz session (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "numQuestions": 10
}
```

**Response:**
```json
{
  "sessionId": "session_...",
  "question": { ... },
  "totalQuestions": 10,
  "currentQuestion": 1
}
```

#### `POST /api/quiz/answer`
Submit an answer to the current question (requires authentication).

**Request:**
```json
{
  "sessionId": "session_...",
  "questionId": "1",
  "answerIndex": 2
}
```

#### `GET /api/quiz/results/:sessionId`
Get detailed results for a completed quiz session (requires authentication).

#### `GET /api/quiz/history`
Get quiz history for the authenticated user.

### Leaderboard

#### `GET /api/leaderboard/best?limit=10`
Get leaderboard sorted by best score.

#### `GET /api/leaderboard/average?limit=10`
Get leaderboard sorted by average score.

#### `GET /api/leaderboard/my-rank?sortBy=best`
Get your current rank (requires authentication).

#### `GET /api/leaderboard/my-scores?limit=10`
Get your recent scores (requires authentication).

## 🧮 Adaptive Algorithm

The adaptive algorithm works as follows:

1. **Initial Difficulty**: Starts at medium difficulty
2. **Correct Answer**: 
   - If 2+ consecutive correct → Move to harder difficulty
   - Otherwise → Stay at current difficulty
3. **Incorrect Answer**: Move to easier difficulty
4. **Difficulty Levels**: Easy → Medium → Hard

## 🛠️ Technologies Used

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Node.js**: Runtime environment
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

## 📝 Development

### Backend Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Run production build

### Frontend Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After registering or logging in, you'll receive a token that should be included in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_token>
```

Tokens are automatically stored in localStorage and included in API requests.

## 🏆 Leaderboard

The leaderboard tracks user performance in two ways:
- **Best Score**: Rankings based on highest percentage achieved
- **Average Score**: Rankings based on average performance across all quizzes

Users can view:
- Top performers
- Their own rank
- Recent scores
- Total quizzes completed

## 🎯 Future Enhancements

- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] More question categories
- [ ] Achievements and badges
- [ ] Question difficulty analytics
- [ ] Multiplayer quiz mode
- [ ] Export quiz results as PDF
- [ ] Social features (friend challenges)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

