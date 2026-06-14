# 🌟 SolVurai — AI-Powered Tamil Dialogue & Expression Platform

> **DTEC 2026 Hackathon Submission**
> *"ChatGPT + Grammarly + Duolingo for Tamil"*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Groq](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-F55036?style=for-the-badge)](https://groq.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 👩‍💻 Developer

**Rethika S**
DTEC 2026 — Tamil Technology & Cultural Innovation Hackathon

---

## ✨ What is SolVurai?

**SolVurai** (சொல்வுரை — *"The Art of Expression"*) is a full-stack AI platform built to celebrate, preserve, and modernize the Tamil language using cutting-edge AI.

Users can:
- 🗣️ **Generate** realistic Tamil dialogues across 8+ real-life scenarios
- 🔄 **Transform** dialogue style between Formal, Spoken, Literary, and Simplified Tamil
- 🎭 **Adapt** emotional tone dynamically — Happy → Angry → Respectful → Emotional
- 📊 **Analyze** grammar, fluency, vocabulary, and formality with AI-powered scoring
- 💾 **Save & Export** dialogues to History, PDF, or TXT
- 🌗 **Toggle** between Dark and Light heritage-themed UI
- 🔤 **Type in English or Tanglish** — AI auto-converts to Tamil script

---

## 🤖 Why We Switched from Gemini to Groq

During development and testing, we initially used **Google Gemini 1.5 Flash** as our AI backbone. However, we encountered a critical limitation:

> The Gemini free tier allows only **50 requests per day per project**, which is insufficient for a hackathon demo environment where multiple features are being tested repeatedly.

We switched to **Groq (LLaMA 3.3-70B Versatile)** for the following reasons:

| Reason | Gemini Free Tier | Groq Free Tier |
|--------|-----------------|----------------|
| Requests per day | 50 | **14,400** |
| Speed | Moderate | **Ultra-fast (LPU chip)** |
| Tamil language quality | Good | **Excellent** |
| Reliability for demo | Limited | **Production-ready** |
| Setup complexity | Medium | **Simple API key** |

Groq runs on their custom **LPU (Language Processing Unit)** chip, making it significantly faster than traditional GPU-based inference. The **LLaMA 3.3-70B** model produces high-quality Tamil text that matches our requirements perfectly.

---

## 🏗️ Architecture Overview

```
SolVurai
├── frontend/                   # Next.js 15 + TypeScript + Tailwind CSS
│   ├── src/app/                # App Router pages
│   │   ├── page.tsx            # Landing page with Vanakkam splash
│   │   ├── auth/               # Login / Signup page
│   │   └── dashboard/          # Protected dashboard routes
│   ├── src/components/
│   │   ├── splash/             # வணக்கம் cultural splash screen
│   │   ├── features/           # Generator, Transformer, Emotion, Grammar, History
│   │   ├── layout/             # Sidebar navigation
│   │   └── ui/                 # ThemeToggle, QuotaError, ExportButton
│   ├── src/hooks/              # useAuth, useTheme
│   ├── src/services/           # api.ts, firestore.ts
│   └── src/lib/                # Firebase config, utils
│
├── backend/                    # FastAPI + Python
│   ├── app/api/routes/         # generate, transform, emotion, grammar, health
│   ├── app/services/           # Groq AI service layer (gemini_service.py)
│   ├── app/models/             # Pydantic request/response schemas
│   └── app/core/               # Config, settings
│
├── docs/                       # Firestore rules, deployment guides
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase project
- Groq API key (free at groq.com)

---

### 1. Clone & Setup

```bash
git clone https://github.com/Rethika-2782/solvurai-dtec2026
cd solvurai
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your Firebase config values
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
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install fastapi uvicorn python-dotenv groq httpx firebase-admin pydantic pydantic-settings python-multipart aiofiles
cp .env.example .env
# Fill in your Groq API key
uvicorn app.main:app --reload
```

**Environment variables** (`backend/.env`):
```env
GROQ_API_KEY=your_groq_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
ALLOWED_ORIGINS=http://localhost:3000
```

---

### 4. Get Your Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google
3. Click **API Keys** → **Create API Key**
4. Copy and paste into `backend/.env`

---

### 5. Firebase Setup

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google Sign-In + Email/Password
3. Create **Firestore Database** → Start in test mode
4. Go to **Project Settings** → **Service accounts** → **Generate new private key**
5. Save as `backend/firebase-service-account.json`

**Firestore Security Rules:**
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /dialogues/{dialogueId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🌐 Deployment

### Frontend → Vercel (Free)

```bash
cd frontend
npx vercel --prod
```

Add all `NEXT_PUBLIC_*` environment variables in Vercel dashboard.
Set `NEXT_PUBLIC_API_URL` to your Render backend URL.

### Backend → Render (Free)

1. Push `backend/` folder to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. **Build command:** `pip install fastapi uvicorn python-dotenv httpx firebase-admin pydantic pydantic-settings python-multipart aiofiles`
4. **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GROQ_API_KEY` = your key
   - `ALLOWED_ORIGINS` = your Vercel URL

---

## 🎯 Core Features

| Feature | Description | AI |
|---------|-------------|-----|
| 🗣️ Dialogue Generator | 8 scenarios × 7 emotions × 4 styles × 3 difficulty levels | Groq LLaMA 3.3 |
| 🔄 Style Transformer | Convert between Spoken / Formal / Literary / Simplified Tamil | Groq LLaMA 3.3 |
| 🎭 Emotion Engine | Same dialogue recolored with 7 different emotions | Groq LLaMA 3.3 |
| 📊 Grammar Intelligence | Scores: Grammar, Fluency, Vocabulary, Formality (0–100) | Groq LLaMA 3.3 |
| 💾 History System | Firebase Firestore — save, view, delete, search dialogues | Firestore |
| 📥 Export | Download as PDF or TXT with beautiful formatting | Client-side |
| 🌗 Theme Toggle | Dark mode (default) + Light mode with heritage Tamil colors | CSS |
| 🔤 Tanglish Support | Type in English or Tanglish — AI converts to Tamil script | Groq LLaMA 3.3 |

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/generate` | POST | Generate Tamil dialogue |
| `/api/transform` | POST | Transform dialogue style |
| `/api/emotion` | POST | Adapt emotional tone |
| `/api/grammar` | POST | Analyze grammar + scores |

---

## 🎨 Design Philosophy

SolVurai is designed with **Tamil cultural heritage** at its core:

- **வணக்கம் Splash Screen** — Animated Tamil greeting with kolam patterns
- **Thiruvalluvar Background** — Subtle image of the great Tamil poet
- **Olaichuvadi Cards** — Palm-leaf manuscript inspired card style for Thirukkural
- **Saffron + Violet palette** — Colors inspired by Tamil temple architecture
- **Noto Sans Tamil font** — Crisp, beautiful Tamil script rendering

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Built with ❤️ for Tamil — சொல்வுரை DTEC 2026*
*Developer: **Rethika S***
