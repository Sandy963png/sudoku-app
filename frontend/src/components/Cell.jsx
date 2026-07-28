import React from 'react';

export default function Cell({ row, col, value, isGiven, isError, onChange }) {
  function handleChange(e) {
    const digit = e.target.value.replace(/[^1-9]/g, '').slice(-1);
    onChange(row, col, digit ? parseInt(digit, 10) : 0);
  }

  const classes = [
    'cell',
    isGiven ? 'given' : 'editable',
    isError ? 'error' : '',
    col % 3 === 2 && col !== 8 ? 'border-right' : '',
    row % 3 === 2 && row !== 8 ? 'border-bottom' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      className={classes}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value === 0 ? '' : value}
      readOnly={isGiven}
      onChange={handleChange}
    />
  );
}
