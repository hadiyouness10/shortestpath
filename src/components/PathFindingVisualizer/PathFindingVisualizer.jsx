import React, { Component, useLayoutEffect } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import Node from './Node/Node';
import Navbar from '../Navbar/Navbar';

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
            visualizingAlgorithm: false,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            currentAlgorithm: null,
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

    startPathFinder(algorithm){

        if(algorithm == "dijkstra"){
            this.visualizeDijkstra()
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

    clearBoard(){

       
        console.log("clicked")
        const grid = [];
        for (let row = 0; row < window.innerHeight/25 - 8; row++) {
        const currentRow = [];
        for (let col = 0; col < window.innerWidth/25 - 4; col++) {
                
            currentRow.push(this.createNode(col, row));
        }
        grid.push(currentRow);
        }
        this.setState({grid})


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
        isWall: false,
        previousNode: null

    };
    
};


    render() {
        const { grid } = this.state;
       
        return (
            <>
            <Navbar

            visualizingAlgorithm={this.state.visualizingAlgorithm}
            // generatingMaze={this.state.generatingMaze}
            visualizeDijkstra={this.visualizeDijkstra.bind(this)}
            // visualizeAStar={this.visualizeAStar.bind(this)}
            visualizeBestFirstSearch={this.visualizeBestFirstSearch.bind(this)}
            visualizeBidirectionalSearch={this.visualizeBidirectionalSearch.bind(this)}
            visualizeBreadthFirstSearch={this.visualizeBreadthFirstSearch.bind(this)}
            visualizeDepthFirstSearch={this.visualizeDepthFirstSearch.bind(this)}
            // generateRandomMaze={this.generateRandomMaze.bind(this)}
            // generateRecursiveDivisionMaze={this.generateRecursiveDivisionMaze.bind(
            // this
            // )}
            // generateVerticalMaze={this.generateVerticalMaze.bind(this)}
            // generateHorizontalMaze={this.generateHorizontalMaze.bind(this)}
            // clearGrid={this.clearGrid.bind(this)}
            // clearPath={this.clearPath.bind(this)}
            // updateSpeed={this.updateSpeed.bind(this)}
            
            />


            <div className ="grid">
                {grid.map((row, idx) => {
                    return (
                        <div key={idx}>
                            {row.map((node, idx1) => {
                                const {row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node
                                        width = {window.innerWidth}
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

