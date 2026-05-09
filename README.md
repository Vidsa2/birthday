# 🎂 Birthday Memories App

A beautiful, full-stack birthday web application for a special birthday girl turning 23 on **May 08, 2026**. Built with React, Node.js + Express, and Firebase.

---

## ✨ Features

| Page | Features |
|------|----------|
| **Dashboard** | Countdown timer, age stats, birthday wishes, quick navigation |
| **Surprise** | Animated gift boxes, balloon float, cake animation, confetti, photo slideshow, background music |
| **Cutie Pie** | Firebase photo upload/gallery with drag-and-drop, heart frames, lightbox |
| **Private Pie** | Password-protected page, bcrypt verification via backend, private notes & photos |

**Design**: Soft purple/pink girly theme · Framer Motion animations · Floating hearts · Glassmorphism cards · Playfair Display + Dancing Script fonts

---

## 🗂 Folder Structure

```
birthday-app/
├── backend/
│   ├── src/index.js          # Express server + Firebase Admin
│   ├── .env.example          # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   ├── HeartBubbles.js
│   │   │   ├── CountdownTimer.js
│   │   │   ├── GiftBoxAnimation.js
│   │   │   ├── AnimatedCard.js
│   │   │   └── PhotoGallery.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Surprise.js
│   │   │   ├── CutiePie.js
│   │   │   └── PrivatePie.js
│   │   ├── utils/
│   │   │   └── firebase.js   # Firebase config
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── firestore.rules
├── storage.rules
└── README.md
```

---

## 🚀 Setup Guide

### Step 1 — Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Firestore Database** (start in test mode)
3. Enable **Storage** (start in test mode)
4. Go to **Project Settings** → **Your Apps** → Add a **Web App**
5. Copy the `firebaseConfig` object

### Step 2 — Get Service Account Key (for backend)

1. Firebase Console → **Project Settings** → **Service Accounts**
2. Click **Generate new private key** → download the JSON
3. You'll use values from this JSON in the backend `.env`

### Step 3 — Set up the Backend

```bash
cd birthday-app/backend
cp .env.example .env
# Fill in all values from your service account JSON and Firebase config
npm install
npm run dev   # runs on http://localhost:5000
```

### Step 4 — Set the Private Page Password

```bash
# With your backend running, call this once to set the password:
curl -X POST http://localhost:5000/api/set-password \
  -H "Content-Type: application/json" \
  -d '{"password": "yourPassword123", "adminSecret": "your-admin-secret-from-env"}'
```

The password is **bcrypt-hashed** and stored in Firestore. It is never exposed to the client.

### Step 5 — Set up the Frontend

```bash
cd birthday-app/frontend
cp .env.example .env
# Fill in REACT_APP_FIREBASE_* values from Step 1
npm install
npm start   # runs on http://localhost:3000
```

### Step 6 — Deploy Firebase Rules

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore + Storage, use existing project
# Copy firestore.rules and storage.rules to project root
firebase deploy --only firestore:rules,storage
```

---

## 🎵 Adding Birthday Music

Upload an MP3 to Firebase Storage at path: `audio/birthday.mp3`

The Surprise page will automatically detect and play it.

---

## 📸 Adding Photos

Use the **Cutie Pie** page to upload photos via drag-and-drop. They are stored in Firebase Storage and their URLs are saved in Firestore.

---

## 🔒 Private Memories (Database)

Add private memories to Firestore using the Firebase Console or Admin SDK:

**Collection**: `private_memories`  
**Document fields**:
```json
{
  "title": "Our First Meeting",
  "content": "I still remember the first time we talked...",
  "createdAt": <timestamp>
}
```

---

## 🌐 Production Deployment

### Backend → Railway / Render / Fly.io
```bash
# Set all environment variables in your platform's dashboard
# Set FRONTEND_URL to your deployed frontend URL
```

### Frontend → Vercel / Netlify
```bash
# Set all REACT_APP_* environment variables in your platform's dashboard
# Set REACT_APP_API_URL to your deployed backend URL
```

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router 6, Framer Motion, Tailwind concepts via CSS variables
- **Backend**: Node.js, Express, bcryptjs, express-rate-limit, helmet
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (photos + audio)
- **Security**: bcrypt password hashing, rate limiting, CORS, helmet headers

---

Made with 💜 for the most special birthday girl 🎂
