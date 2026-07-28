// Backend URL — hardcoded as a reliable fallback since env vars weren't
// reaching the production build. Change this if the backend URL changes.
const BACKEND_URL = 'https://sudoku-app-rvmq.onrender.com';
const BASE = `${BACKEND_URL}/api/puzzles`;

export async function fetchNewPuzzle(difficulty) {
  const res = await fetch(`${BASE}/new?difficulty=${difficulty}`);
  return res.json();
}

export async function checkPuzzle(id, board) {
  const res = await fetch(`${BASE}/${id}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board })
  });
  return res.json();
}

export async function getHint(id, board) {
  const res = await fetch(`${BASE}/${id}/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board })
  });
  return res.json();
}

export async function solvePuzzle(id) {
  const res = await fetch(`${BASE}/${id}/solve`);
  return res.json();
}