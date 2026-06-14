# 🌟 SolVurai — AI-Powered Tamil Dialogue & Expression Platform

> **DTEC 2026 Hackathon Submission**  
> "ChatGPT + Grammarly + Duolingo for Tamil"

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## ✨ What is SolVurai?

SolVurai (சொல்வுரை — "The Art of Expression") is a full-stack AI platform that helps users:
- 🗣️ **Generate** realistic Tamil dialogues across 8+ scenarios
- 🔄 **Transform** dialogue between Formal, Spoken, Literary, and Simplified Tamil
- 🎭 **Adapt** emotional tone dynamically (Happy → Angry → Respectful)
- 📊 **Analyze** grammar, fluency, and vocabulary with AI scoring
- 💾 **Save & Export** dialogues as PDF/TXT

---

## 🏗️ Architecture Overview

```
SolVurai
├── frontend/          # Next.js 15 + TypeScript + Tailwind
│   ├── src/app/       # App Router pages
│   ├── src/components/# Reusable UI components
│   ├── src/services/  # API + Firebase services
│   ├── src/hooks/     # Custom React hooks
│   └── src/lib/       # Firebase config, utilities
│
├── backend/           # FastAPI + Python
│   ├── app/api/       # REST API routes
│   ├── app/services/  # Gemini AI service layer
│   ├── app/models/    # Pydantic data models
│   └── app/core/      # Config, Firebase admin
│
└── docs/              # Deployment guides
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase project
- Google Gemini API key

---

### 1. Clone & Setup

```bash
git clone https://github.com/your-team/solvurai
cd solvurai
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your Firebase + Backend URL
npm run dev
```

**Environment variables** (`frontend/.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your Gemini API key + Firebase service account
uvicorn app.main:app --reload
```

**Environment variables** (`backend/.env`):
```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
ALLOWED_ORIGINS=http://localhost:3000,https://solvurai.vercel.app
```

---

### 4. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google Sign-In + Email/Password
3. Create **Firestore Database** in production mode
4. Add Firestore security rules (see `docs/firestore-rules.txt`)
5. Download **Service Account JSON** → place at `backend/firebase-service-account.json`

**Firestore Collections:**
```
users/{uid}
  - email, displayName, photoURL, createdAt, stats

dialogues/{docId}
  - userId, title, content, scenario, emotion, style, 
    difficulty, grammarScore, createdAt, tags
```

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
# Set environment variables in Vercel dashboard
```

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

---

## 🎯 Core Features

| Feature | Description | AI Model |
|---------|-------------|----------|
| Dialogue Generator | 8 scenarios × 7 emotions × 4 styles | Gemini 1.5 Flash |
| Style Transformer | Convert between Tamil variants | Gemini 1.5 Flash |
| Emotion Engine | Adapt emotional tone dynamically | Gemini 1.5 Flash |
| Grammar Intelligence | Score + explain Tamil grammar | Gemini 1.5 Flash |
| History System | Firebase-backed save/search/delete | Firestore |
| Export | PDF + TXT formatted download | Client-side |

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate Tamil dialogue |
| `/api/transform` | POST | Transform dialogue style |
| `/api/emotion` | POST | Adapt emotional tone |
| `/api/grammar` | POST | Analyze grammar + scores |
| `/api/health` | GET | Health check |

---

## 👥 Team

Built with ❤️ for DTEC 2026 — Tamil Technology & Cultural Innovation

---

## 📄 License

MIT License — Free to use, modify, and distribute.
