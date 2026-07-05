# Interview AI — Local Setup & Run Guide

This repository is a **monorepo-style** project under `interview-ai-yt/` with two apps:

| App | Path | Stack | Default URL |
|-----|------|-------|-------------|
| **Backend** | `Backend/` | Node.js, Express 5, MongoDB, Google Gemini, Puppeteer | http://localhost:3000 |
| **Frontend** | `Frontend/` | React 19, Vite 7, Axios | http://localhost:5173 |

The product is an **AI interview prep tool**: users register/login, upload a resume PDF, paste a job description, and receive an AI-generated interview plan (technical/behavioral questions, skill gaps, preparation roadmap). Users can also download a tailored resume PDF.

---

## Architecture

```
Frontend (React + Vite)
  ├── /login, /register          → auth.api.js → POST /api/auth/*
  ├── /                          → Home (upload resume, generate report)
  └── /interview/:interviewId    → Interview (view report, download PDF)

Backend (Express)
  ├── /api/auth/*                → JWT in httpOnly-style cookie ("token")
  └── /api/interview/*           → PDF parse → Gemini → MongoDB
```

**Auth flow:** Email/password registration with `bcryptjs`. JWT stored in a cookie (`token`). Protected routes use `auth.middleware.js` (cookie + blacklist on logout).

**AI flow:** Resume PDF → `pdf-parse` → text → **Google Gemini** (`gemini-3-flash-preview`) with Zod JSON schema → saved to MongoDB.

**PDF resume flow:** Stored report data → Gemini generates HTML → **Puppeteer** renders PDF.

---

## Prerequisites

### Required software

| Tool | Version (this project) | Notes |
|------|------------------------|-------|
| **Node.js** | **v22.22.0** tested; use **≥ 22.12.0** or **≥ 20.19.0** | Required by Vite 7 and `pdf-parse` v2 |
| **npm** | **11.6.2** tested | No minimum specified in `package.json` |
| **MongoDB** | 6.x or 7.x (local) **or** MongoDB Atlas | Not installed on a fresh Windows machine by default |

Neither `Backend/package.json` nor `Frontend/package.json` define an `engines` field. Effective minimums come from dependencies:

- `vite@7.3.1` → Node `^20.19.0 \|\| >=22.12.0`
- `pdf-parse@2.4.5` → Node `>=20.16.0 <21 \|\| >=22.3.0`

### External services (accounts / keys)

| Service | Required? | Purpose |
|---------|-----------|---------|
| **MongoDB** | **Yes** | Users, blacklist tokens, interview reports |
| **Google Gemini API** | **Yes** (for AI features) | Interview report + resume PDF generation |
| **Puppeteer (Chromium)** | Auto-installed | Resume PDF rendering; first run may download Chromium |
| OAuth (Google/GitHub) | No | Not used |
| Cloud storage (S3, etc.) | No | Files kept in memory via Multer |
| Email (SendGrid, etc.) | No | Not used |
| OpenAI | No | Project uses Google GenAI only |

---

## Environment variables

### Backend (`Backend/.env`)

Copy the example file:

```powershell
cd interview-ai-yt\Backend
copy .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWT cookies |
| `GOOGLE_GENAI_API_KEY` | **Yes** (for interview/PDF features) | API key from [Google AI Studio](https://aistudio.google.com/apikey) |

#### Where each variable is used

| Variable | File | Usage |
|----------|------|-------|
| `MONGO_URI` | `Backend/src/config/database.js:8` | `mongoose.connect(process.env.MONGO_URI)` |
| `JWT_SECRET` | `Backend/src/controllers/auth.controller.js:41,87` | `jwt.sign(..., process.env.JWT_SECRET)` on register/login |
| `JWT_SECRET` | `Backend/src/middlewares/auth.middleware.js:27` | `jwt.verify(token, process.env.JWT_SECRET)` |
| `GOOGLE_GENAI_API_KEY` | `Backend/src/services/ai.service.js` | Lazy-init `GoogleGenAI` client when generating reports/PDFs |

**Hardcoded (not env-driven):**

| Setting | File | Value |
|---------|------|-------|
| Server port | `Backend/server.js:8` | `3000` |
| CORS origin | `Backend/src/app.js:10` | `http://localhost:5173` |
| API base URL (frontend) | `Frontend/src/features/auth/services/auth.api.js:5` | `http://localhost:3000` |
| API base URL (frontend) | `Frontend/src/features/interview/services/interview.api.js:4` | `http://localhost:3000` |

### Frontend (`Frontend/.env`)

**No environment variables are required.** The API URL is hardcoded to `http://localhost:3000`. A placeholder `Frontend/.env.example` is included for future `VITE_API_URL` support.

---

## Dependencies & scripts

### Backend (`Backend/package.json`)

**Dependencies:** `@google/genai`, `bcryptjs`, `cookie-parser`, `cors`, `dotenv`, `express`, `jsonwebtoken`, `mongoose`, `multer`, `pdf-parse`, `puppeteer`, `zod`, `zod-to-json-schema`

**Scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npx nodemon server.js` | Dev server with auto-reload (nodemon fetched via npx) |
| `test` | placeholder | Not implemented |

### Frontend (`Frontend/package.json`)

**Dependencies:** `axios`, `react`, `react-dom`, `react-router`, `sass`

**Dev dependencies:** `vite`, `@vitejs/plugin-react`, `eslint`, etc.

**Scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Dev server at http://localhost:5173 |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Lint |

---

## Installation (step by step)

### 1. Clone / open the project

```powershell
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt
```

If cloning from Git:

```powershell
git clone <your-repo-url> interview-ai-yt
cd interview-ai-yt
```

### 2. Install backend dependencies

```powershell
cd Backend
npm install
```

### 3. Install frontend dependencies

```powershell
cd ..\Frontend
npm install
```

### 4. Set up MongoDB

**Option A — MongoDB Atlas (recommended if you don't have MongoDB locally)**

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow your IP (or `0.0.0.0/0` for dev only)
3. Copy the connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/interview-ai`

**Option B — Local MongoDB**

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the `MongoDB` Windows service
3. Use: `mongodb://127.0.0.1:27017/interview-ai`

### 5. Create backend `.env`

```powershell
cd ..\Backend
copy .env.example .env
```

Edit `.env` and set real values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/interview-ai
JWT_SECRET=replace-with-a-long-random-string
GOOGLE_GENAI_API_KEY=your-key-from-google-ai-studio
```

### 6. Get a Google Gemini API key

1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Paste it into `GOOGLE_GENAI_API_KEY` in `Backend/.env`

---

## Run commands

Use **two terminals**.

### Terminal 1 — Backend

```powershell
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt\Backend
npm run dev
```

Expected output:

```
Connected to Database
Server is running on port 3000
```

### Terminal 2 — Frontend

```powershell
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt\Frontend
npm run dev
```

Expected output:

```
VITE v7.x.x  ready
➜  Local:   http://localhost:5173/
```

---

## Verify the application works

1. Open http://localhost:5173 — you should be redirected to `/login`.
2. Register at http://localhost:5173/register (username, email, password).
3. After login, you land on `/` (Home).
4. Paste a **job description**, add a **self description** or upload a **PDF resume** (max 3 MB on backend; UI says 5 MB).
5. Click **Generate My Interview Strategy** — wait ~30s for Gemini.
6. You should navigate to `/interview/:id` with technical questions, behavioral questions, and a roadmap.
7. Test logout via the app (if wired) or `GET http://localhost:3000/api/auth/logout` with cookies.

**Quick API smoke test (no auth):**

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/get-me" -UseBasicParsing
```

Expected: `401` with `{"message":"Token not provided."}`

---

## API routes reference

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Login |
| GET | `/logout` | Public | Logout + blacklist token |
| GET | `/get-me` | Private | Current user |

### Interview (`/api/interview`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Private | Upload resume PDF + generate report |
| GET | `/` | Private | List user's reports |
| GET | `/report/:interviewId` | Private | Get one report |
| POST | `/resume/pdf/:interviewReportId` | Private | Download tailored resume PDF |

---

## Code fixes applied in this repo

These issues prevented or impaired local runs and were fixed:

1. **`pdf-parse` v2 API** (`Backend/src/controllers/interview.controller.js`)  
   - Was: `new PDFParse(Uint8Array.from(buffer))`  
   - Now: `new PDFParse({ data: req.file.buffer })`

2. **Gemini client crash on startup** (`Backend/src/services/ai.service.js`)  
   - Was: `new GoogleGenAI()` at module load (crashes if key missing)  
   - Now: lazy `getAiClient()` — server starts; AI routes fail with a clear error if the key is missing

---

## Troubleshooting

### `Server is running on port 3000` but `Connected to Database` never appears

- MongoDB is not running or `MONGO_URI` is wrong.
- **Fix:** Start MongoDB service or fix Atlas connection string / IP whitelist.

### `Error: API key must be set when using the Gemini API`

- `GOOGLE_GENAI_API_KEY` is empty or missing in `Backend/.env`.
- **Fix:** Add a valid key from Google AI Studio and restart the backend.

### Frontend shows login loop / 401 on every action

- Backend not running, or cookies blocked.
- **Fix:** Ensure backend is on port 3000, frontend on 5173, and `withCredentials: true` is set (already is in `auth.api.js` / `interview.api.js`).

### CORS errors in browser console

- Frontend must be exactly `http://localhost:5173` (configured in `Backend/src/app.js`).
- **Fix:** Don't use a different port unless you update CORS `origin`.

### Resume upload fails / empty report

- Only **PDF** is supported by the backend (`pdf-parse`). DOCX in the UI is not implemented.
- **Fix:** Upload a `.pdf` file under 3 MB.

### `EADDRINUSE` on port 3000 or 5173

```powershell
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### Puppeteer / Chromium errors (resume PDF download)

- First PDF generation downloads Chromium (~150 MB).
- **Fix:** Ensure disk space and allow network; on Windows, antivirus may block Chromium — add an exception.

### `npm audit` vulnerabilities

- Run `npm audit` in `Backend` or `Frontend` for details. Not blocking for local dev.

---

## Project structure

```
interview-ai-yt/
├── Backend/
│   ├── server.js                 # Entry: dotenv, DB, listen :3000
│   ├── .env.example
│   └── src/
│       ├── app.js                # Express + CORS + routes
│       ├── config/database.js
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/ai.service.js
├── Frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── app.routes.jsx
│       ├── features/auth/
│       └── features/interview/
└── RUN_PROJECT.md                # This file
```

---

## One-shot command cheat sheet (PowerShell)

```powershell
# From repo root
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt

# Install
cd Backend; npm install; cd ..\Frontend; npm install

# Configure (once)
cd ..\Backend
copy .env.example .env
# Edit .env with notepad/code — set MONGO_URI, JWT_SECRET, GOOGLE_GENAI_API_KEY

# Run backend (terminal 1)
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt\Backend
npm run dev

# Run frontend (terminal 2)
cd C:\Users\maham\OneDrive\Desktop\Coding\main_projects\Prep_Guide\interview-ai-yt\Frontend
npm run dev
```

Open **http://localhost:5173** after both servers are running.
