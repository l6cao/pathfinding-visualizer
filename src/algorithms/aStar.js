export const aStar = (grid, startNode, endNode) => {
  const openSet = [];
  const closedSet = new Set();
  const cameFrom = new Map();

  startNode.g = 0;
  startNode.f = heuristic(startNode, endNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Sort the open set by the f value
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current === endNode) {
      return reconstructPath(cameFrom, current);
    }

    closedSet.add(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.g + 1; // Assume each edge has a weight of 1
      if (!openSet.includes(neighbor)) {
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + heuristic(neighbor, endNode);
        cameFrom.set(neighbor, current);
        openSet.push(neighbor);
      } else if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + heuristic(neighbor, endNode);
        cameFrom.set(neighbor, current);
      }
    }
  }

  // Return an empty array if there is no path
  return [];
};

const heuristic = (nodeA, nodeB) => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
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
