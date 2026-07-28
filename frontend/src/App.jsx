import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board.jsx';
import Controls from './components/Controls.jsx';
import { fetchNewPuzzle, checkPuzzle, getHint, solvePuzzle } from './api.js';

function emptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export default function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzleId, setPuzzleId] = useState(null);
  const [given, setGiven] = useState(emptyBoard());
  const [board, setBoard] = useState(emptyBoard());
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('Pick a difficulty to start playing.');
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startTimer() {
    clearInterval(timerRef.current);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  async function newGame(diff) {
    setLoading(true);
    setMessage('Generating puzzle...');
    try {
      const data = await fetchNewPuzzle(diff);
      setDifficulty(diff);
      setPuzzleId(data.id);
      setGiven(data.board.map((r) => [...r]));
      setBoard(data.board.map((r) => [...r]));
      setErrors([]);
      setSolved(false);
      setMessage(`New ${diff} puzzle ready. Good luck!`);
      startTimer();
    } catch (err) {
      setMessage('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function updateCell(r, c, value) {
    if (given[r][c] !== 0) return;
    const next = board.map((row) => [...row]);
    next[r][c] = value;
    setBoard(next);
    setErrors(errors.filter((e) => !(e.row === r && e.col === c)));
  }

  async function handleCheck() {
    if (!puzzleId) return;
    const result = await checkPuzzle(puzzleId, board);
    setErrors(result.errors);
    if (result.solved) {
      setMessage('🎉 Solved! Great job!');
      setSolved(true);
      clearInterval(timerRef.current);
    } else if (result.errors.length > 0) {
      setMessage(`Found ${result.errors.length} mistake(s) — marked in red.`);
    } else {
      setMessage('Looking good so far, keep going!');
    }
  }

  async function handleHint() {
    if (!puzzleId) return;
    const hint = await getHint(puzzleId, board);
    if (hint.done) {
      setMessage('Board is already full.');
      return;
    }
    updateCell(hint.row, hint.col, hint.value);
    setMessage('Hint applied — one cell filled in for you.');
  }

  async function handleSolve() {
    if (!puzzleId) return;
    const { solution } = await solvePuzzle(puzzleId);
    setBoard(solution.map((r) => [...r]));
    setErrors([]);
    setSolved(true);
    setMessage('Computer solved the puzzle.');
    clearInterval(timerRef.current);
  }

  function handleClear() {
    const next = board.map((row, r) => row.map((v, c) => (given[r][c] !== 0 ? v : 0)));
    setBoard(next);
    setErrors([]);
    setSolved(false);
    setMessage('Board cleared.');
  }

  return (
    <div className={`app${solved ? ' is-solved' : ''}`}>
      <div className="app-card">
        <h1>Sudoku</h1>
        <Controls
          difficulty={difficulty}
          onNewGame={newGame}
          onCheck={handleCheck}
          onHint={handleHint}
          onSolve={handleSolve}
          onClear={handleClear}
          seconds={seconds}
          loading={loading}
          hasPuzzle={!!puzzleId}
        />
        <p className={`message${solved ? ' celebrate' : ''}`}>{message}</p>
        <Board board={board} given={given} errors={errors} onChange={updateCell} />
      </div>
    </div>
  );
}
