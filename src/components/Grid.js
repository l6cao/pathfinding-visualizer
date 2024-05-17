import React, { useState } from 'react';
import './Grid.css';
import { aStar } from '../algorithms/aStar';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';

const Grid = () => {
  const [grid, setGrid] = useState(createInitialGrid());
  const [isStartSelected, setIsStartSelected] = useState(false);
  const [isEndSelected, setIsEndSelected] = useState(false);
  const [history, setHistory] = useState([]);
  const [hint, setHint] = useState('Click to add a starting point (green block).');
  const [error, setError] = useState('');
  const [isVisualized, setIsVisualized] = useState(false);

  const handleCellClick = (row, col) => {
    if (isVisualized) {
      setError('Visualization is active. Click "Revert" to edit the grid.');
      return;
    }

    const newGrid = grid.slice();
    const cell = newGrid[row][col];

    if (cell.isStart || cell.isEnd) {
      return; // Prevent placing obstacles on start or end points
    }

    if (cell.isWall) {
      setError('Cell is already occupied. Try another cell.');
      return; // Prevent placing obstacles on existing obstacles
    } else {
      setError('');
    }

    if (!isStartSelected) {
      cell.isStart = true;
      setIsStartSelected(true);
      setHint('Click to add an ending point (red block).');
    } else if (!isEndSelected) {
      cell.isEnd = true;
      setIsEndSelected(true);
      setHint('Click to add obstacles (black blocks).');
    } else {
      cell.isWall = true;
    }

    setHistory([...history, { row, col, cell: { ...cell } }]);
    setGrid(newGrid);
  };

  const handleRevert = () => {
    if (isVisualized) {
      const newGrid = grid.map(row =>
        row.map(cell => ({
          ...cell,
          isPath: false,
          isVisited: false,
          distance: Infinity,
        }))
      );
      setGrid(newGrid);
      setIsVisualized(false);
      setHint('Visualization removed. Click to edit the grid.');
      return;
    }

    const newHistory = history.slice();
    const lastChange = newHistory.pop();
    if (lastChange) {
      const newGrid = grid.slice();
      const cell = newGrid[lastChange.row][lastChange.col];

      if (cell.isStart) {
        cell.isStart = false;
        setIsStartSelected(false);
        setHint('Click to add a starting point (green block).');
      } else if (cell.isEnd) {
        cell.isEnd = false;
        setIsEndSelected(false);
        setHint('Click to add an ending point (red block).');
      } else {
        cell.isWall = false;
      }

      setGrid(newGrid);
      setHistory(newHistory);
    }
  };

  const handleClear = () => {
    setGrid(createInitialGrid());
    setIsStartSelected(false);
    setIsEndSelected(false);
    setHistory([]);
    setHint('Click to add a starting point (green block).');
    setError('');
    setIsVisualized(false); // Allow editing after clearing
  };

  const handleVisualize = (algorithm) => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isPath: false,
        isVisited: false,
        distance: Infinity,
      }))
    );
    const startNode = newGrid.flat().find(cell => cell.isStart);
    const endNode = newGrid.flat().find(cell => cell.isEnd);

    if (!startNode || !endNode) {
      setError('Please set both a start and an end point.');
      return;
    }

    const path = algorithm(newGrid, startNode, endNode);

    if (path.length === 0) {
      setError('No path found.');
      return;
    }

    for (const node of path) {
      if (!node.isEnd) {
        newGrid[node.row][node.col].isPath = true;
      }
    }

    setGrid(newGrid);
    setIsVisualized(true);
    setHint('Visualization complete. Click "Revert" to remove visualization and edit.');
  };

  return (
    <div className="grid-container">
      <div className="grid-and-controls">
        <table className="grid">
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`cell ${cell.isStart ? 'cell-start' : ''} ${cell.isEnd ? 'cell-end' : ''} ${cell.isWall ? 'cell-wall' : ''} ${cell.isPath ? 'cell-path' : ''}`}
                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="controls">
          <button onClick={handleRevert}>Revert</button>
          <button onClick={handleClear}>Clear</button>
          <button onClick={() => handleVisualize(aStar)}>Visualize A*</button>
          <button onClick={() => handleVisualize(dijkstra)}>Visualize Dijkstra</button>
          <button onClick={() => handleVisualize(bfs)}>Visualize BFS</button>
        </div>
      </div>
      <p className="hint">{hint}</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

const createInitialGrid = () => {
  const rows = 20;
  const cols = 20;
  const initialGrid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createCell(col, row));
    }
    initialGrid.push(currentRow);
  }

  return initialGrid;
};

const createCell = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isEnd: false,
    isWall: false,
    isPath: false,
    isVisited: false,
    distance: Infinity,
  };
};

export default Grid;
