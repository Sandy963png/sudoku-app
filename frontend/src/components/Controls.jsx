import React from 'react';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function Controls({
  difficulty,
  onNewGame,
  onCheck,
  onHint,
  onSolve,
  onClear,
  seconds,
  loading,
  hasPuzzle
}) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="controls">
      <div className="difficulty-select">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={d === difficulty ? 'active' : ''}
            onClick={() => onNewGame(d)}
            disabled={loading}
          >
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div className="timer">⏱ {mins}:{secs}</div>
      <div className="actions">
        <button onClick={onCheck} disabled={!hasPuzzle}>Check</button>
        <button onClick={onHint} disabled={!hasPuzzle}>Hint</button>
        <button onClick={onSolve} disabled={!hasPuzzle}>Solve (Computer)</button>
        <button onClick={onClear} disabled={!hasPuzzle}>Clear</button>
      </div>
    </div>
  );
}
