import React, { Component, useLayoutEffect } from 'react';
import { aStarAlgorithm, reconstructPath } from '../../algorithms/aStar';
import { breadthFirstSearch, getNodesInShortestPathOrderBreadth } from '../../algorithms/breadthFirstSearch';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import { depthFirstSearch, getNodesInShortestPathOrderDepth } from '../../algorithms/deapthFirstSearch';
import { bestFirstSearch, getNodesInShortestPathOrderBest } from '../../algorithms/bestFirstSearch';
import { bidirectionalSearch, getNodesInShortestPathOrderBidirectionalSearch } from '../../algorithms/bidirectionalSearch';

import Node from './Node/Node';
import Navbar from '../Navbar/Navbar';

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


    animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder) {
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

    animateBidirectionalAlgorithm(visitedNodesInOrderStart,visitedNodesInOrderFinish,nodesInShortestPathOrder, isShortedPath) {

        for (let i = 1; i <= Math.max(visitedNodesInOrderStart.length,visitedNodesInOrderFinish.length); i++) {
          
        //   let visitedNodesInOrder = getVisitedNodesInOrder(visitedNodesInOrderStart,visitedNodesInOrderFinish);


          if (i === visitedNodesInOrderStart.length) {
            setTimeout(() => {
              if (isShortedPath) {
                this.animateShortestPath(nodesInShortestPathOrder);
              } else {
                  //add code if algorithm is false
              }
            }, i * 10);
            return;
          }
          setTimeout(() => {
            //visited nodes
            let nodeA = visitedNodesInOrderStart[i];
            let nodeB = visitedNodesInOrderFinish[i]
            ;
            if (nodeA !== undefined)
              document.getElementById(`node-${nodeA.row}-${nodeA.col}`).className ="node node-visited";
            if (nodeB !== undefined)
              document.getElementById(`node-${nodeB.row}-${nodeB.col}`).className ="node node-visited";
          }, i * 10);
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
        // console.log(nodesInShortedPathOrder)
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder);
        console.log(grid)
    }
    visualizeBreadthFirstSearch() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        console.log(visitedNodesInOrder.length)
        const nodesInShortedPathOrder = getNodesInShortestPathOrderBreadth(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder);
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


    visualizeDepthFirstSearch() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
        console.log(visitedNodesInOrder.length)
        const nodesInShortedPathOrder = getNodesInShortestPathOrderDepth(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder);
        // console.log(nodesInShortedPathOrder)
    }


    visualizeBestFirstSearch() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bestFirstSearch(grid, startNode, finishNode);
        console.log(visitedNodesInOrder.length)
        const nodesInShortedPathOrder = getNodesInShortestPathOrderBest(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder);
        // console.log(nodesInShortedPathOrder)
    }

    visualizeBidirectionalSearch() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bidirectionalSearch(grid, startNode, finishNode);
        
        const visitedNodesInOrderStart = visitedNodesInOrder[0];
        const visitedNodesInOrderFinish = visitedNodesInOrder[1];
        const isShortedPath = visitedNodesInOrder[2];
        const nodesInShortedPathOrder = getNodesInShortestPathOrderBidirectionalSearch(
        visitedNodesInOrderStart[visitedNodesInOrderStart.length - 1],
        visitedNodesInOrderFinish[visitedNodesInOrderFinish.length - 1]
      );

      this.animateBidirectionalAlgorithm(
        visitedNodesInOrderStart,
        visitedNodesInOrderFinish,
        nodesInShortedPathOrder,
        isShortedPath
      );
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
        totalDistance: Infinity,
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
            <React.Fragment>
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
            </React.Fragment>
        );
    };
}

// const getVisitedNodesInOrder = (
//     visitedNodesInOrderStart,
//     visitedNodesInOrderFinish
//   ) => {
//     let visitedNodesInOrder = [];
//     let n = Math.max(
//       visitedNodesInOrderStart.length,
//       visitedNodesInOrderFinish.length
//     );
//     for (let i = 0; i < n; i++) {
//       if (visitedNodesInOrderStart[i] !== undefined) {
//         visitedNodesInOrder.push(visitedNodesInOrderStart[i]);
//       }
//       if (visitedNodesInOrderFinish[i] !== undefined) {
//         visitedNodesInOrder.push(visitedNodesInOrderFinish[i]);
//       }
//     }
//     return visitedNodesInOrder;
//   };

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