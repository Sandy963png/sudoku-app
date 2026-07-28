# Sudoku (React + Express + MongoDB/Mongoose)

A full Sudoku game you can run on localhost:
- Three difficulty levels: Easy, Medium, Hard
- Computer help: Check your answers, get a Hint, or have the computer fully Solve it
- Puzzles are generated on the backend (backtracking algorithm) and stored in MongoDB via Mongoose

## Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or an Atlas connection string)
  - Local install: https://www.mongodb.com/docs/manual/installation/
  - Quick check: `mongod --version`

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if your MongoDB URI is different
npm run dev
```

This starts the API at http://localhost:5000 and connects to MongoDB
(default: `mongodb://127.0.0.1:27017/sudoku`, created automatically on first use).

If you don't have `nodemon` and don't want the dev-reload, just run `npm start`.

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

This starts the React app at http://localhost:5173 (Vite's dev server proxies
`/api` calls to the backend on port 5000 — see `vite.config.js`).

## 3. Play

Open http://localhost:5173 in your browser:
1. Pick a difficulty (Easy / Medium / Hard) — a new puzzle is generated and saved to MongoDB.
2. Fill in cells (only empty ones are editable).
3. **Check** — highlights any wrong cells in red.
4. **Hint** — fills in one correct cell for you.
5. **Solve (Computer)** — instantly fills in the full solution.
6. **Clear** — wipes your entries, keeping the original clues.

## How the "computer helper" works

- `backend/utils/sudokuGenerator.js` builds a full valid solved grid via
  randomized backtracking, then removes cells (36/46/54 for easy/medium/hard)
  to create the puzzle.
- `backend/utils/sudokuSolver.js` is a classic constraint-based backtracking
  solver — used to validate the generator's output and to power full solves.
- The solution is stored server-side in MongoDB and never sent to the browser
  except one cell at a time (hint) or all at once (solve), so it can't be
  peeked at via dev tools mid-game.

## Project structure

```
sudoku-app/
  backend/
    server.js
    models/Puzzle.js
    routes/puzzleRoutes.js
    utils/sudokuGenerator.js
    utils/sudokuSolver.js
  frontend/
    src/
      App.jsx
      api.js
      components/Board.jsx
      components/Cell.jsx
      components/Controls.jsx
      styles.css
```

## Possible next steps
- Add user accounts + saved game progress
- Add a leaderboard (fastest solve time per difficulty)
- Add pencil-mark / notes mode
- Add puzzle uniqueness-guarantee check in the generator
