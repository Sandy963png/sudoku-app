import { isValid } from './sudokuSolver.js';

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fills an empty 9x9 grid into a complete, valid, randomized Sudoku solution.
function fillGrid(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(grid, r, c, num)) {
            grid[r][c] = num;
            if (fillGrid(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// How many of the 81 cells to blank out per difficulty level.
const REMOVE_COUNTS = { easy: 36, medium: 46, hard: 54 };

export function generatePuzzle(difficulty = 'easy') {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(solution);

  const board = solution.map((row) => [...row]);
  const removals = REMOVE_COUNTS[difficulty] ?? REMOVE_COUNTS.easy;
  const cellOrder = shuffle(Array.from({ length: 81 }, (_, i) => i));

  let removed = 0;
  for (const idx of cellOrder) {
    if (removed >= removals) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    board[r][c] = 0;
    removed++;
  }

  return { board, solution };
}
