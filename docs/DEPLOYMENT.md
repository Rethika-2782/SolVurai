# SolVurai — Deployment Guide

## 1. Firebase Setup (5 minutes)

1. Go to https://console.firebase.google.com
2. Create project → name it "solvurai"
3. Authentication → Sign-in method → Enable:
   - Google
   - Email/Password
4. Firestore Database → Create database → Production mode
5. Firestore → Rules → Paste contents of docs/firestore-rules.txt
6. Project Settings → Service accounts → Generate new private key
   → Save as backend/firebase-service-account.json
7. Project Settings → General → Your apps → Web app → Copy config

---

## 2. Frontend → Vercel

```bash
cd frontend
npm install

# Create .env.local with your Firebase config
cp .env.local.example .env.local
# Edit .env.local with real values

# Deploy
npx vercel --prod
```

In Vercel dashboard → Settings → Environment Variables:
Add all NEXT_PUBLIC_* variables from .env.local
Add: NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

---

## 3. Backend → Render

1. Push backend/ folder to a GitHub repo

2. Go to https://render.com → New Web Service

3. Connect GitHub repo → Select backend folder

4. Settings:
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   - Environment: Python 3.11

5. Environment Variables:
   - GEMINI_API_KEY=your_key
   - FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   - ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

6. Add firebase-service-account.json as a secret file

---

## 4. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Add to backend/.env as GEMINI_API_KEY

---

## 5. Final Test

1. Visit your Vercel URL
2. See வணக்கம் splash screen
3. Sign in with Google
4. Generate your first Tamil dialogue!

---

## Local Development

```bash
# Terminal 1: Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in values
uvicorn app.main:app --reload
# Backend runs at http://localhost:8000

# Terminal 2: Frontend  
cd frontend
npm install
cp .env.local.example .env.local  # Fill in values
npm run dev
# Frontend runs at http://localhost:3000
```
