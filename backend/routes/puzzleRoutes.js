import express from 'express';
import Puzzle from '../models/Puzzle.js';
import { generatePuzzle } from '../utils/sudokuGenerator.js';
import { solveSudoku } from '../utils/sudokuSolver.js';

const router = express.Router();

// Fetches a puzzle board from the free Sugoku API (no key required).
// Sugoku only gives the puzzle, not the solution, so we solve it ourselves
// with our own backtracking solver before saving both to MongoDB.
async function fetchFromSugoku(difficulty) {
  const url = `https://sugoku.onrender.com/board?difficulty=${difficulty}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeout);

  if (!response.ok) throw new Error(`Sugoku API responded ${response.status}`);
  const data = await response.json();

  // Sugoku returns { board: [[...9x9 with 0 for blanks...]] }
  const board = data.board;
  const solution = solveSudoku(board);
  if (!solution) throw new Error('Could not solve puzzle fetched from Sugoku');

  return { board, solution };
}

// GET /api/puzzles/new?difficulty=easy|medium|hard
// Tries to fetch a real puzzle from the Sugoku API first; if that's
// unreachable (e.g. no internet, blocked network), falls back to our own
// local generator so the app still works offline.
router.get('/new', async (req, res) => {
  const difficulty = ['easy', 'medium', 'hard'].includes(req.query.difficulty)
    ? req.query.difficulty
    : 'easy';

  let board, solution, source;
  try {
    ({ board, solution } = await fetchFromSugoku(difficulty));
    source = 'sugoku';
  } catch (err) {
    console.warn('Sugoku fetch failed, falling back to local generator:', err.message);
    ({ board, solution } = generatePuzzle(difficulty));
    source = 'local';
  }

  try {
    const puzzle = await Puzzle.create({ difficulty, board, solution });
    res.json({ id: puzzle._id, difficulty, board, source });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save puzzle' });
  }
});

// POST /api/puzzles/:id/check  { board }
// Compares the user's current board against the stored solution.
router.post('/:id/check', async (req, res) => {
  try {
    const { board } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });

    const errors = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0 && board[r][c] !== puzzle.solution[r][c]) {
          errors.push({ row: r, col: c });
        }
      }
    }
    const solved = errors.length === 0 && board.flat().every((v) => v !== 0);

    res.json({ errors, solved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check puzzle' });
  }
});

// POST /api/puzzles/:id/hint  { board }
// Returns one correct value for a random currently-empty cell.
router.post('/:id/hint', async (req, res) => {
  try {
    const { board } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });

    const empties = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) empties.push({ r, c });
      }
    }
    if (empties.length === 0) return res.json({ done: true });

    const pick = empties[Math.floor(Math.random() * empties.length)];
    res.json({ row: pick.r, col: pick.c, value: puzzle.solution[pick.r][pick.c] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get hint' });
  }
});

// GET /api/puzzles/:id/solve
// Returns the full solution so the computer can solve the whole board.
router.get('/:id/solve', async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ error: 'Puzzle not found' });
    res.json({ solution: puzzle.solution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to solve puzzle' });
  }
});

export default router;
