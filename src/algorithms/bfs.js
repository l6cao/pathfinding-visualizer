export const bfs = (grid, startNode, endNode) => {
  const queue = [startNode];
  const cameFrom = new Map();
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === endNode) {
      return reconstructPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        cameFrom.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  // Return an empty array if there is no path
  return [];
};

const getNeighbors = (node, grid) => {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isWall);
};

const reconstructPath = (cameFrom, current) => {
  const path = [];
  while (cameFrom.has(current)) {
    path.push(current);
    current = cameFrom.get(current);
  }
  return path.reverse();
};
