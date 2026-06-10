# QuizPulse ⚡

A real-time, **Mentimeter-style live quiz app**. A host creates a room and questions; players join with a room code and answer live; everyone watches an animated leaderboard update each round.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion** on the frontend and **Node + Express + Socket.io** on the backend. Ships as a **single deployable service** — the backend serves the built frontend.

## Features

- 🎮 Host dashboard: create a room, add MCQ questions, mark the correct answer
- 🕹️ Live controls: Start, Next question, Show leaderboard, End
- ⚡ Speed-based scoring — faster correct answers score more
- 🏆 Animated podium + leaderboard
- 🎨 Fully redesigned UI with aurora background and motion throughout
- 🔒 Correct answers are never sent to players
- 🚀 One-command deploy (Docker / Render / Railway)

## Project structure

```
Quiz-app-/
├─ Frontend/        # React + Vite + Tailwind + Framer Motion
├─ backend/         # Express + Socket.io game server (also serves the built frontend)
├─ Dockerfile       # single-image production build
├─ render.yaml      # Render.com blueprint
└─ package.json     # root orchestration scripts
```

## Local development

Run the backend and frontend in two terminals:

```bash
# terminal 1 — backend (http://localhost:3000)
cd backend && npm install && npm run dev

# terminal 2 — frontend (http://localhost:5173)
cd Frontend && npm install && npm run dev
```

Open http://localhost:5173. In dev the frontend talks to the backend at `http://localhost:3000` automatically.

- **Host:** go to `/admin`, enter the admin password (default `ADMIN_PASSWORD`), create a room, add questions, hit **Start quiz**.
- **Play:** open `/user` in another tab/device, enter the room code and your name.

## Production build (single service)

```bash
npm run build   # installs deps, builds frontend, compiles backend
npm start       # serves UI + API on http://localhost:3000
```

The backend serves `Frontend/dist` and handles Socket.io on the same origin, so there's nothing else to host.

## Deployment

### Docker
```bash
docker build -t quizpulse .
docker run -p 3000:3000 -e ADMIN_PASSWORD=your-secret quizpulse
```

### Render
Push to GitHub and create a **Blueprint** from `render.yaml`, or a Web Service with:
- Build command: `npm run build`
- Start command: `npm start`
- Health check path: `/health`

### Railway / Fly / any Node host
- Build: `npm run build`
- Start: `npm start`
- The platform's `PORT` env var is used automatically.

## Environment variables (backend)

| Variable         | Default          | Description                                   |
| ---------------- | ---------------- | --------------------------------------------- |
| `PORT`           | `3000`           | Port to listen on (set by most platforms)     |
| `ADMIN_PASSWORD` | `ADMIN_PASSWORD` | Password required on the host (`/admin`) page |
| `CORS_ORIGIN`    | `*`              | Allowed origin for Socket.io                  |

### Deploying the frontend separately (optional)
If you host the frontend on its own (e.g. Vercel), set `VITE_SERVER_URL` to your backend URL at build time. By default the frontend uses the same origin in production.

## Notes
State is in-memory, so quizzes reset if the server restarts — perfect for live sessions, no database required.
