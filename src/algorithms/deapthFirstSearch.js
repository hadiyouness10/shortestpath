export function depthFirstSearch(grid, startNode, endNode){
    const visitedNodesInOrder = [];
    const stack = [];
    stack.push(startNode);
    let count =0;
    while(stack.length > 0 && count<1000){
        const currNode = stack.pop();
        if(currNode.isWall) continue;
        visitedNodesInOrder.push(currNode);
        if(currNode == endNode){
            return visitedNodesInOrder;
        }
        currNode.isVisited = true;
        let neighbors  = [];
        neighbors = getUnvisitedNeighbors(currNode, grid);
        for(let i=0;i<neighbors.length;i++){
            if(neighbors[i].isVisited) return;
            if(!stack.includes(neighbors[i])){
                stack.push(neighbors[i])
            }
        }
        count++;
        updateUnvisistedNeighbors(currNode, grid);
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    console.log(node);
    if (row > 0) {
        neighbors.unshift(grid[row - 1][col]);
    }
    if (row < grid.length - 1) {
        neighbors.unshift(grid[row + 1][col]);
    }
    if (col > 0) {
        neighbors.unshift(grid[row][col - 1]);
    }
    if (col < grid[0].length - 1) {
        neighbors.unshift(grid[row][col + 1]);
    }
    console.log(neighbors.filter(neighbor => !neighbor.isVisited));
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function updateUnvisistedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.previousNode = node;
    }
}

export function getNodesInShortestPathOrderDepth(finishNode) {
    const getNodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        getNodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return getNodesInShortestPathOrder;
}


