export function bidirectionalSearch(grid, startNode, endNode){

    if(!startNode || !endNode || startNode === endNode){
        return false;
    }

    let unvisitedNodesStart = [];
    let unvisitedNodesFinish = [];

    let visitedNodesInOrderStart = [];
    let visitedNodesInOrderFinish = [];

    startNode.distance =0;
    endNode.distance=0;

    unvisitedNodesStart.push(startNode);
    unvisitedNodesFinish.push(endNode);

    while(unvisitedNodesStart.length >0 && unvisitedNodesFinish.length>0){
        unvisitedNodesFinish.sort((a,b) =>a.totalDistance - b.totalDistance);
        unvisitedNodesStart.sort((a,b) => a.totalDistance - b.totalDistance);

        let closestNodeStart = unvisitedNodesStart.shift();
        let closesetNodeEnd = unvisitedNodesFinish.shift();

        closesetNodeEnd.isVisited = true;
        closestNodeStart.isVisited = true;

        visitedNodesInOrderFinish.push(closesetNodeEnd);
        visitedNodesInOrderStart.push(closestNodeStart);

        //both interesect at a common node
        if(isNeighbour(closestNodeStart,closesetNodeEnd)){
            return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
        }

        //Search from Start Side
        let neighbours = getNeighbours(closestNodeStart, grid);
        for(let neighbour of neighbours){
            if(!neighbourNotinUnvisitedNodes(neighbour,unvisitedNodesFinish)){
                visitedNodesInOrderStart.push(closestNodeStart);
                visitedNodesInOrderFinish.push(neighbour)
                return [visitedNodesInOrderStart,visitedNodesInOrderFinish,true]
            }
            let distance  = closestNodeStart.distance +1;
            if(neighbourNotinUnvisitedNodes(neighbour, unvisitedNodesStart)){
                unvisitedNodesStart.unshift(neighbour);
                neighbour.distance =distance;
                neighbour.totalDistance = manhattenDistance(neighbour, endNode);
                neighbour.previousNode = closestNodeStart;

            }else if(distance < neighbour.distance){
                neighbour.distance = distance;
                neighbour.totalDistance = manhattenDistance(neighbour, endNode);
                neighbour.previousNode = closestNodeStart;

            }
            if(neighbour.hasWeight)neighbour.distance+=5;

        }

        //Search from End Side
        neighbours = getNeighbours(closesetNodeEnd, grid);
        for(let neighbour of neighbours){
            if(!neighbourNotinUnvisitedNodes(neighbour, unvisitedNodesStart)){
                visitedNodesInOrderStart.push(closesetNodeEnd);
                visitedNodesInOrderStart.push(neighbour);
                return[visitedNodesInOrderStart,visitedNodesInOrderFinish,true]
            }
            let distance = closesetNodeEnd.distance+1;
            if(neighbourNotinUnvisitedNodes(neighbour,unvisitedNodesFinish)){
                unvisitedNodesFinish.unshift(neighbour);
                neighbour.distance = distance;
                neighbour.totalDistance = manhattenDistance(neighbour,startNode)
                neighbour.previousNode = closesetNodeEnd;
            }else if(distance<neighbour.distance){
                neighbour.distance = distance;
                neighbour.totalDistance = manhattenDistance(neighbour,startNode)
                neighbour.previousNode = closesetNodeEnd;
            }
            if(neighbour.hasWeight){
                neighbour.totalDistance+=5;
                console.log('has weight', neighbour.distance)
            }

        }
    }

    return [visitedNodesInOrderStart,visitedNodesInOrderFinish,false];

}

function isNeighbour(closestNodeStart, closesetNodeEnd) {
    let rowStart = closestNodeStart.row;
    let colStart = closestNodeStart.col;
    let rowFinish = closesetNodeEnd.row;
    let colFinish = closesetNodeEnd.col;
    if (rowFinish === rowStart - 1 && colFinish === colStart) return true;
    if (rowFinish === rowStart && colFinish === colStart + 1) return true;
    if (rowFinish === rowStart + 1 && colFinish === colStart) return true;
    if (rowFinish === rowStart && colFinish === colStart - 1) return true;
    return false;
  }

  function getNeighbours(node, grid){

    let neighbours = [];
    let row = node.row;
    let col = node.col;
    if(row > 0){
        neighbours.push(grid[row-1][col])
    }
    if(row < grid.length -1){
        neighbours.push(grid[row+1][col])
    }
    if(col > 0){
        neighbours.push(grid[row][col-1])
    }
    if(col < grid[0].length-1){
        neighbours.push(grid[row][col+1])
    }

    return( neighbours.filter(neighbour => !neighbour.isVisited));


  }

  function neighbourNotinUnvisitedNodes(neighbour, unvisitedNodes){
      for(let node of unvisitedNodes){
          if(neighbour.row == node.row && neighbour.col == node.col){
              return false;
          }
      }
      return true;


  }

  function manhattenDistance(nodeA, nodeB){
      let x = Math.abs(nodeA.row - nodeB.row);
      let y = Math.abs(nodeA.col - nodeB.col);
      return x+y;

    }

    export function getNodesInShortestPathOrderBidirectionalSearch(nodeA,nodeB) {
        let nodesInShortestPathOrder = [];
        let currentNode = nodeB;
        while (currentNode !== null) {
          nodesInShortestPathOrder.push(currentNode);
          currentNode = currentNode.previousNode;
        }
        currentNode = nodeA;
        while (currentNode !== null) {
          nodesInShortestPathOrder.unshift(currentNode);
          currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
      }