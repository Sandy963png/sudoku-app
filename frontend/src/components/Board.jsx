import React from 'react';
import Cell from './Cell.jsx';

export default function Board({ board, given, errors, onChange }) {
  const isError = (r, c) => errors.some((e) => e.row === r && e.col === c);

  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((val, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            value={val}
            isGiven={given[r][c] !== 0}
            isError={isError(r, c)}
            onChange={onChange}
          />
        ))
      )}
    </div>
  );
}
