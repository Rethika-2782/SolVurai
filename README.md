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
- 🔤 Tanglish → Tamil Unicode Conversion
- 🌐 English → Tamil Intelligent Processing
- 🌗 Dark / Light Theme Support
- 📚 Daily Tamil Word & Proverb Recommendations
- 🔐 Firebase Authentication (Google + Email Login)
- 📈 Personalized Learning Dashboard
---

## 🎓 Educational Impact

SolVurai helps learners:

- Practice conversational Tamil
- Improve grammar and vocabulary
- Understand emotional expression
- Learn formal and literary Tamil
- Preserve Tamil cultural heritage through AI

The platform bridges modern AI technologies with Tamil language education, making learning more interactive and engaging.

```
## 🌐 Live demo
Frontend:

https://solvurai.vercel.app

Backend:

https://solvurai.onrender.com

Demo Video:

https://drive.google.com/file/d/1YXzBcSk2gakHegIUogH8n8Myk8S3DQ7k/view?usp=drivesdk


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
git clone https://github.com/Rethika-2782/SolVurai.git
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
GROQ_API_KEY=your_groq_api_key
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
| Dialogue Generator | 8 scenarios × 7 emotions × 4 styles | Groq |
| Style Transformer | Convert between Tamil variants | Groq |
| Emotion Engine | Adapt emotional tone dynamically | Groq |
| Grammar Intelligence | Score + explain Tamil grammar | Groq |
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

## 📸 Screenshots

These are the screenshots of the website : 
 
<img width="1918" height="972" alt="Screenshot 2026-06-15 155443" src="https://github.com/user-attachments/assets/6b7d38db-cb12-4430-b547-9d09ed646df7" />
<img width="1918" height="967" alt="Screenshot 2026-06-15 155505" src="https://github.com/user-attachments/assets/835a2352-2592-462b-9b89-6b6dc929d7d9" />
<img width="1915" height="971" alt="Screenshot 2026-06-15 155537" src="https://github.com/user-attachments/assets/8f0ef312-b9a0-4b4b-8828-ae210f8b0a11" />
<img width="1918" height="971" alt="Screenshot 2026-06-15 155600" src="https://github.com/user-attachments/assets/f240d1bd-1047-4bfd-960c-dc3a93723687" />
<img width="1912" height="907" alt="Screenshot 2026-06-15 155737" src="https://github.com/user-attachments/assets/2626384f-9959-4c5f-92a3-ff839d9ed607" />
<img width="1918" height="902" alt="Screenshot 2026-06-15 161830" src="https://github.com/user-attachments/assets/982604cc-e0c0-423a-9cb0-5cf803e44d5e" />
<img width="1917" height="912" alt="Screenshot 2026-06-15 162816" src="https://github.com/user-attachments/assets/ab1270a8-e935-43f9-9ddc-b6d705aa5892" />
<img width="1918" height="905" alt="Screenshot 2026-06-15 162840" src="https://github.com/user-attachments/assets/95518fbe-14fd-44d3-b42d-7006e5caa314" />
<img width="1918" height="907" alt="Screenshot 2026-06-15 162854" src="https://github.com/user-attachments/assets/4e662a72-173d-470f-8f39-1f95a202c3e6" />
<img width="1918" height="912" alt="Screenshot 2026-06-15 162912" src="https://github.com/user-attachments/assets/d13d6647-bc76-428c-ad64-9d3fa0415586" />
<img width="1918" height="907" alt="Screenshot 2026-06-15 162232" src="https://github.com/user-attachments/assets/6f89f65c-b75f-46c0-b6c8-15a995e4d1a6" />
<img width="1918" height="906" alt="Screenshot 2026-06-15 162302" src="https://github.com/user-attachments/assets/e6a61408-ca9f-4797-a5f6-278bca20743c" />
<img width="1917" height="912" alt="Screenshot 2026-06-15 162334" src="https://github.com/user-attachments/assets/df433d33-1a4a-4b17-8363-04dcf2beced4" />
<img width="1915" height="915" alt="Screenshot 2026-06-15 162355" src="https://github.com/user-attachments/assets/2d0a8ad7-a9fe-4d67-8e03-e7ab66ea0251" />
<img width="1917" height="907" alt="Screenshot 2026-06-15 162421" src="https://github.com/user-attachments/assets/fb86023b-e3bb-4757-be3c-e960ccd48200" />
<img width="1918" height="911" alt="Screenshot 2026-06-15 162446" src="https://github.com/user-attachments/assets/1a762e0c-aebe-4ab4-b7be-67f32ee3be8a" />
<img width="1918" height="911" alt="Screenshot 2026-06-15 162507" src="https://github.com/user-attachments/assets/e0403a73-1f1b-4f33-81ec-8329d61a5fee" />
<img width="1918" height="912" alt="Screenshot 2026-06-15 162131" src="https://github.com/user-attachments/assets/3c576c32-0fe5-4be6-b1dd-0cb555b598c3" />
<img width="1918" height="917" alt="Screenshot 2026-06-15 162146" src="https://github.com/user-attachments/assets/a91e09a7-f499-44c9-adf6-9acfa75148c3" />
<img width="1918" height="912" alt="Screenshot 2026-06-15 164254" src="https://github.com/user-attachments/assets/4baaee71-ac6c-4b57-8f1f-e27d96a7f37c" />
<img width="1918" height="900" alt="Screenshot 2026-06-15 164313" src="https://github.com/user-attachments/assets/f1e48137-c73a-466d-8b94-8a71172a957b" />

Mobile Respnosive too.. 

https://drive.google.com/file/d/1jV67mbVRdnYXSj5oeFyIBpnh4EKCvY0l/view?usp=drivesdk

https://drive.google.com/file/d/1DKrnSzJBM8wqaIZ825BQx7jdJbcVoHa8/view?usp=drivesdk

https://drive.google.com/file/d/1EszSPKa3QjsJYRXV7PWZ_SEbAerYB6bj/view?usp=drivesdk


## 🏆 DTEC 2026 Hackathon Submission

Hackathon Title:
SolVurai

Category:
Dialogue Generator / Sentence Builder

Submitted for:
DTEC 2026 Hackathon

Primary Focus:
Tamil AI Education, Dialogue Generation, Grammar Intelligence, and Language Learning

---
