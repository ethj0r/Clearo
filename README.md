# Clearo - Pomodoro Productivity App

> Stay focused, stay productive. Clearo uses AI-powered object detection to keep you accountable during your Pomodoro sessions.

## Overview

Clearo is a gamified productivity app that combines the Pomodoro Technique with real-time AI object detection to help you stay focused while studying or working. Using your webcam and machine learning, Clearo detects distractions (like smartphones) and tracks your productivity with a points and streak system.

### Key Features

- **Pomodoro Timer** - Customizable focus sessions
- **Real-time Object Detection** - Distraction monitoring using TensorFlow.js
- **Gamification** - Points, streaks, and leaderboard
- **Session History** - Track your productivity over time
- **Secure Authentication** - JWT-based auth with PostgreSQL
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- **React 18** with Vite
- **TensorFlow.js** + COCO-SSD for object detection
- **React Router** for navigation
- **CSS3** for styling

### Backend
- **Node.js** + Express
- **PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway PostgreSQL

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 15+
- Webcam (for object detection)

### 1. Clone Repository
```bash
git clone https://github.com/ethj0r/Clearo.git
cd Clearo
```

### 2. Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start backend
npm run dev
# Backend runs on http://localhost:5001
```

### 3. Setup Frontend
```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Make sure VITE_API_URL=http://localhost:5001/api

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Access the App
1. Open browser: `http://localhost:5173`
2. Register a new account
3. Allow webcam access
4. Start your first Pomodoro session!

## Project Structure

```
clearo/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── context/    # AuthContext
│   │   ├── hooks/      # usePomodoro, useObjectDetection
│   │   ├── pages/      # Login, Register, Dashboard
│   │   ├── services/   # API client
│   │   └── App.jsx
│   └── package.json
│
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── config/     # Database config
│   │   ├── controllers/# Auth & Session controllers
│   │   ├── models/     # User & Session models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## How It Works

1. **Start Session**: Click "Start Pomodoro" to begin a 25-minute focus session
2. **AI Monitoring**: Your webcam feeds video to TensorFlow.js COCO-SSD model
3. **Distraction Detection**: 
   - **Smartphone detected** → Distracted
   - **Person not visible** → Distracted (you left)
   - **Focused** → Earning points!
4. **Points & Streaks**:
   - Complete Pomodoro: **+10 points**
   - No distractions: **+5 bonus**
   - Daily streak: **+5 to +50 bonus**
   - Each distraction: **-2 points**
5. **End Session**: Get your score and compete on the leaderboard!

## API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user (protected)
```

### Sessions
```
POST   /api/session/start    # Start Pomodoro session
PUT    /api/session/:id      # Update session (report distraction)
POST   /api/session/:id/end  # End session and calculate points
GET    /api/session/history  # Get user's session history
GET    /api/session/leaderboard  # Get top users
```

## Deployment

### Deploy Backend to Railway
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy!

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Import project on Vercel
3. Set `VITE_API_URL` to Railway backend URL
4. Deploy!

**Detailed deployment guide**: See [Deployment Guide artifact](#)

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Roadmap

- [x] Basic Pomodoro timer
- [x] User authentication
- [x] Object detection with TensorFlow.js
- [x] Points and streak system
- [ ] Leaderboard page
- [ ] Session history visualization (charts)
- [ ] Custom Pomodoro durations
- [ ] Break timer
- [ ] Sound alerts
- [ ] Dark/light theme toggle
- [ ] Social features (friends, challenges)
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

**Project Developer**: Jordhy Branenda
- GitHub: [@ethj0r](https://github.com/ethj0r)
- Email: charlesinlotte@gmail.com ethgalleryin@gmail.com 13524026@mahasiswa.itb.ac.id
- Website: [Clearo.app](https://clearo-by-ethjor.vercel.app)

---