import React from 'react';
import './Cell.css';

const Cell = ({ col, row, isStart, isEnd, isWall }) => {
  const extraClassName = isStart
    ? 'cell-start'
    : isEnd
    ? 'cell-end'
    : isWall
    ? 'cell-wall'
    : '';

  return <div className={`cell ${extraClassName}`} id={`cell-${row}-${col}`}></div>;
};

export default Cell;
