import React, { Component } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import Node from './Node/Node';

import './PathFindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();

        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }
    
    componentDidMount() {
        const grid = getIntialGrid();
        this.setState({ grid });
    }


    animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortedPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = `node node-visited`;
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortedPathOrder) {
        for (let i = 0; i < nodesInShortedPathOrder.length; i++){
            setTimeout(() => {
                const node = nodesInShortedPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 50*i);
        }
    }

    

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortedPathOrder = getNodesInShortestPathOrder(finishNode);
        console.log(nodesInShortedPathOrder)
        this.animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder);
        console.log(grid)
    }

    render() {
        const { grid } = this.state;
        return (

            <>
                <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijskrtra's Algorithm</button>
            <div className ="grid">
                {grid.map((row, idx) => {
                    return (
                        <div key={idx}>
                            {row.map((node, idx1) => {
                                const {row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node
                                        key={idx1}
                                        col={col}
                                        row={row}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall = {isWall}
                                        test={'foo'}></Node>
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

const getIntialGrid = () => {
    const grid = [];
    for (let row = 0; row < 15; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
                
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
    
const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null

    };
    
};