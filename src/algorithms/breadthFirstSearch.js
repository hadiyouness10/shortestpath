export function breadthFirstSearch(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [];
    queue.push(startNode);
    let count = 0;
    while (queue.length > 0 && count < 1000) {
        console.log('queue length before shifting: ' + queue.length)
        const currentNode = queue.shift();
        console.log('queue length after shifting: ' + queue.length)
        if (currentNode.isWall) continue;
        visitedNodesInOrder.push(currentNode);
        if (currentNode == endNode) {
            console.log('found end node')
            return visitedNodesInOrder;
        }
        currentNode.isVisited = true;
        let neighbors = []
        neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isVisited) return;
            if (!queue.includes(neighbors[i]))
                queue.push(neighbors[i])

        }
        count++;
        updateUnvisistedNeighbors(currentNode, grid);

    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    console.log(node);
    if (row > 0) {
        neighbors.push(grid[row - 1][col]);
    }
    if (row < grid.length - 1) {
        neighbors.push(grid[row + 1][col]);
    }
    if (col > 0) {
        neighbors.push(grid[row][col - 1]);
    }
    if (col < grid[0].length - 1) {
        neighbors.push(grid[row][col + 1]);
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

export function getNodesInShortestPathOrderBreadth(finishNode) {
    const getNodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        getNodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return getNodesInShortestPathOrder;
}