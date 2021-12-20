import React, { Component, useLayoutEffect } from 'react';
import { aStarAlgorithm, reconstructPath } from '../../algorithms/aStar';
import { breadthFirstSearch, getNodesInShortestPathOrderBreadth } from '../../algorithms/breadthFirstSearch';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import Node from './Node/Node';

import './PathFindingVisualizer.css';

const START_NODE_ROW = 5;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 5;
const FINISH_NODE_COL = 30;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();

        this.state = {
            grid: [],
            mouseIsPressed: false,
        };

        window.addEventListener('resize', this.getIntialGrid);
    }
    updateGrid() {
        console.log('updating');

        const grid = this.getIntialGrid();
        console.log(grid);
        this.setState({ grid });
    }
    
    componentDidMount() {
        const grid = this.getIntialGrid();
        this.setState({ grid });
        // window.addEventListener("resize", console.log('updating'))

    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }


    animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortedPathOrder);
                }, 10 * i*4);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = `node node-visited`;
            }, 10 * i*4);
        }
    }

    animateShortestPath(nodesInShortedPathOrder) {
        for (let i = 0; i < nodesInShortedPathOrder.length; i++){
            setTimeout(() => {
                const node = nodesInShortedPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 50*i*4);
        }
    }

    

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortedPathOrder = getNodesInShortestPathOrder(finishNode);
        // console.log(nodesInShortedPathOrder)
        this.animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder);
    }
    visualizeBreathFirstSearch() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        console.log(visitedNodesInOrder.length)
        const nodesInShortedPathOrder = getNodesInShortestPathOrderBreadth(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder);
        // console.log(nodesInShortedPathOrder)
    }

    visualizeAStar() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = aStarAlgorithm(startNode, finishNode, grid);
        const nodesInShortestPathOrder = reconstructPath(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        // const nodesInShortedPathOrder = getNodesInShortestPathOrderBreadth(finishNode);
        // this.animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder);
    }


    getIntialGrid = () => {
        const grid = [];
        for (let row = 0; row < window.innerHeight/25 - 8; row++) {
        const currentRow = [];
        for (let col = 0; col < window.innerWidth/25 - 4; col++) {
                
            currentRow.push(this.createNode(col, row));
        }
        grid.push(currentRow);
        }
        this.setState({grid})
        console.log(grid);
    return grid;
};
    
createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        estimatedDistanceToEnd: Infinity,
        distanceFromStart: Infinity,
        isWall: false,
        previousNode: null,
        cameFrom: null,
        hasWeight: row=== 5 && col === 29,
        id: row+'-'+col
    };
    
};

    render() {
        const { grid } = this.state;
        return (
            <>
            <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijskrtra's Algorithm</button>
            <button onClick={() => this.visualizeBreathFirstSearch()}>
            Visualize Breadth First Search</button>
            <button onClick={() => this.visualizeAStar()}>
            Visualize A* Algorithm</button>
            <div className ="grid">
                {grid.map((row, idx) => {
                    return (
                        <div key={idx}>
                            {row.map((node, idx1) => {
                                const {row, col, isFinish, isStart, isWall, estimatedDistanceToEnd, distanceFromStart, id, hasWeight } = node;
                                return (
                                    <Node
                                        width = {window.innerWidth}
                                        key={idx1}
                                        col={col}
                                        row={row}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        id = {id}
                                        hasWeight= {hasWeight}
                                        estimatedDistanceToEnd = {estimatedDistanceToEnd}
                                        distanceFromStart = {distanceFromStart}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                            this.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}></Node>
                                );
                            })}
                        </div>
                    );
                })}
                </div>
            </>
        );
    };
}


const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}


const getNewGridWithWeights = (grid, row, col)=> {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        hasWeight: !node.hasWeight,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}