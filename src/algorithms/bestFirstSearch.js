
export function bestFirstSearch(grid, startNode, endNode){

    const visitedNodesInOrder = []; //closed list
    const unvisitedNodes = []; //open list
    unvisitedNodes.push(startNode);

    while(unvisitedNodes.length > 0){
        unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
        let closestNode = unvisitedNodes.shift();

        if(closestNode.isWall) continue;

        if(closestNode == endNode){
            return visitedNodesInOrder;
        }
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);


        let neighbors  = [];
        neighbors = getUnvisitedNeighbors(closestNode, grid);
        for(let neighbour of neighbors){
            let distance = closestNode.distance + 1;

            if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
              unvisitedNodes.unshift(neighbour);
              neighbour.distance = distance;
              neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
              neighbour.previousNode = closestNode;
            } else if (distance < neighbour.distance) {
              neighbour.distance = distance;
              neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
              neighbour.previousNode = closestNode;
            }
           
        }
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  let neighbours = [];
  let { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  return neighbours.filter(neighbour => !neighbour.isWall && !neighbour.isVisited);
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);
  return x + y;
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

export function getNodesInShortestPathOrderBest(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
