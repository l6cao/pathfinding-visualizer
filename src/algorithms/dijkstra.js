export const dijkstra = (grid, startNode, endNode) => {
  const openSet = [];
  const cameFrom = new Map();

  startNode.distance = 0;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.distance - b.distance);
    const current = openSet.shift();

    if (current === endNode) {
      return reconstructPath(cameFrom, current);
    }

    current.isVisited = true;

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited) continue;

      const tentativeDistance = current.distance + 1; // Assume each edge has a weight of 1

      if (!openSet.includes(neighbor)) {
        neighbor.distance = tentativeDistance;
        cameFrom.set(neighbor, current);
        openSet.push(neighbor);
      } else if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        cameFrom.set(neighbor, current);
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
