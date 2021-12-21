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
import { randomMaze } from '../../mazes/randomMaze';
import { horizontalMaze } from '../../mazes/horizentalMaze';
import { verticalMaze } from '../../mazes/verticalMaze';
import { recursiveDivisionMaze } from '../../mazes/recursiveMaze';

let START_NODE_ROW = 5;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 5;
let FINISH_NODE_COL = 30;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();

        this.state = {
            grid: [],
            mouseIsPressed: false,
            moveStart:false,
            moveFinish:false,
            visualizingAlgorithm: false,
            generatingMaze: false,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            currentAlgorithm: null,
            speed:10,
            mazeSpeed:10,
            feature:'None'
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
        if(row==START_NODE_ROW && col==START_NODE_COL){
        
  
        this.setState({ mouseIsPressed: true, moveStart:true });

        }else if(row==FINISH_NODE_ROW && col==FINISH_NODE_COL){
      
        this.setState({  mouseIsPressed: true, moveFinish:true });
        }
        else if(this.state.feature==="Wall"){

        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
        }else if(this.state.feature==="Weight"){

        const newGrid = getNewGridWithWeights(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
        }
    }

    handleMouseLeave(row, col) {
        if (!this.state.mouseIsPressed) return;

        if(this.state.moveStart || this.state.moveFinish){

            if(row==START_NODE_ROW && col==START_NODE_COL){

            
            document.getElementById(`node-${row}-${col}`).className = "node";
            const newGrid = getNewGridWithStartNodeToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });


            }else if(row==FINISH_NODE_ROW && col==FINISH_NODE_COL){

            document.getElementById(`node-${row}-${col}`).className = "node";
            const newGrid = getNewGridWithFinishNodeToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });

            }
        }
       
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;

        if(this.state.moveStart){
            if(this.state.grid[row][col].isWall){
                return;
            }

        START_NODE_ROW = row;
        START_NODE_COL = col;

        document.getElementById(`node-${row}-${col}`).className = "node node-start";
        const newGrid = getNewGridWithStartNodeToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });

        }else if(this.state.moveFinish){
            if(this.state.grid[row][col].isWall){
                return;
            }

        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
        
        document.getElementById(`node-${row}-${col}`).className = "node node-finish";
        const newGrid = getNewGridWithFinishNodeToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });

        }
        else if(this.state.feature ==="Wall"){
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
        }
        else if(this.state.feature ==="Weight"){
            const newGrid = getNewGridWithWeights(this.state.grid, row, col);
            this.setState({ grid: newGrid });
        }
        
    }

    handleMouseUp(row,col) {
        if(this.state.moveStart){
            if(this.state.grid[row][col].isWall){
                document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = "node node-start";
                const newGrid = getNewGridWithStartNodeToggled(this.state.grid, START_NODE_ROW, START_NODE_COL);
                this.setState({ grid: newGrid });
              
            }
        }else if(this.state.moveFinish){
            if(this.state.grid[row][col].isWall){
                document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = "node node-finish";
                const newGrid = getNewGridWithFinishNodeToggled(this.state.grid, FINISH_NODE_ROW, FINISH_NODE_COL);
                this.setState({ grid: newGrid });
            }
        }


        this.setState({ mouseIsPressed: false, moveStart:false,moveFinish:false });
    }


    animateAlgorithm(visitedNodesInOrder, nodesInShortedPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortedPathOrder);
                }, this.state.speed * i*4);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = `node node-visited`;
            }, this.state.speed * i*4);
        }
        this.setState({ visualizingAlgorithm: false });

    }

    animateBidirectionalAlgorithm(visitedNodesInOrderStart,visitedNodesInOrderFinish,nodesInShortestPathOrder, isShortedPath) {

        for (let i = 1; i <= Math.max(visitedNodesInOrderStart.length,visitedNodesInOrderFinish.length); i++) {
          
        //   let visitedNodesInOrder = getVisitedNodesInOrder(visitedNodesInOrderStart,visitedNodesInOrderFinish);


          if (i === visitedNodesInOrderStart.length) {
            setTimeout(() => {
              if (isShortedPath) {
                this.animateShortestPath(nodesInShortestPathOrder);
              } else {
                this.setState({ visualizingAlgorithm: false });
            }
            }, i * this.state.speed);
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
          }, i * this.state.speed);
        }
      }
    

    animateShortestPath(nodesInShortedPathOrder) {
        for (let i = 0; i < nodesInShortedPathOrder.length; i++){
            setTimeout(() => {
                const node = nodesInShortedPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, this.state.speed *i*20);
        }
        this.setState({ visualizingAlgorithm: false });

    }

    visualizeDijkstra() {
        this.setState({ visualizingAlgorithm: true });
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
        this.setState({ visualizingAlgorithm: true });
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
        this.setState({ visualizingAlgorithm: true });
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = aStarAlgorithm(startNode, finishNode, grid);
        const nodesInShortestPathOrder = reconstructPath(finishNode);
        console.log(nodesInShortestPathOrder)
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        // const nodesInShortedPathOrder = getNodesInShortestPathOrderBreadth(finishNode);
        // this.animateDijkstra(visitedNodesInOrder, nodesInShortedPathOrder);
    }


    visualizeDepthFirstSearch() {
        this.setState({ visualizingAlgorithm: true });
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
        this.setState({ visualizingAlgorithm: true });
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
        this.setState({ visualizingAlgorithm: true });
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

    clearGrid(){
    if(this.state.visualizingAlgorithm){
        return;
    }
    for(let row = 0; row<this.state.grid.length; row++){
        for(let col=0;col<this.state.grid[0].length;col++){
            if(!((row==START_NODE_ROW && col==START_NODE_COL) || (row===FINISH_NODE_ROW && col ===FINISH_NODE_COL))){
                document.getElementById(`node-${row}-${col}`).className = "node";

            }
        }
    }
    const newGrid = this.getIntialGrid();
    this.setState({
        grid:newGrid,
        visualizingAlgorithm:false,
    })
    }

    clearPath(){
        if(this.state.visualizingAlgorithm){
            return;
        }

        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {

                if(document.getElementById(`node-${row}-${col}`).className === "node node-shortest-path"){
                    if(row==START_NODE_ROW && col==START_NODE_COL){
                        document.getElementById(`node-${row}-${col}`).className = "node node-start";
        
                    } else if(row==FINISH_NODE_ROW && col==FINISH_NODE_COL){
                        document.getElementById(`node-${row}-${col}`).className = "node node-finish";
        
                    }else{ 
                        document.getElementById(`node-${row}-${col}`).className = "node";
                    }

                }
            }
        }
        const newGrid = getNewGridWithoutPath(this.state.grid);
        this.setState({
            grid:newGrid,
            visualizingAlgorithm:false,
        })
    }

    clearweightsANDwalls(){
        if(this.state.visualizingAlgorithm){
            return;
        }

        const newGrid = getNewGridWithoutWallsAndWeights(this.state.grid);
        this.setState({
            grid:newGrid,
            visualizingAlgorithm:false,
        })

    }
        
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
            hasWeight:false,
            id: row+'-'+col
        };
        
    };

    updateSpeed(path,maze){
        this.setState({speed:path,mazeSpeed:maze})
    }

    updateFeature(feature){
        this.setState({feature:feature})
    }

    generateRandomMaze(){
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
          }
          this.setState({ generatingMaze: true });
          setTimeout(() =>{

            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = randomMaze(grid,startNode,finishNode);
            this.animateMaze(walls);
          }, this.state.mazeSpeed)
    }

    generateHorizontalMaze(){
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
          }
          this.setState({ generatingMaze: true });
          setTimeout(() =>{

            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = horizontalMaze(grid,startNode,finishNode);
            this.animateMaze(walls);
          }, this.state.mazeSpeed)
    }

    generateVerticalMaze(){
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
          }
          this.setState({ generatingMaze: true });
          setTimeout(() =>{

            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = verticalMaze(grid,startNode,finishNode);
            this.animateMaze(walls);
          }, this.state.mazeSpeed)
    }

    generateRecursiveDivisionMaze(){
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
          }
          this.setState({ generatingMaze: true });
          setTimeout(() =>{

            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = recursiveDivisionMaze(grid,startNode,finishNode);
            this.animateMaze(walls);
          }, this.state.mazeSpeed)
    }

    animateMaze = (walls) =>{
        for(let i =0; i<=walls.length;i++){
            //reached last wall
            if(i === walls.length){
                setTimeout(()=>{
                    this.clearGrid();
                    let newGrid = getNewGridWithMaze(this.state.grid, walls);
                    this.setState({grid:newGrid,generatingMaze:false})

                }, i*this.state.mazeSpeed);
                return;
            }

            let wall = walls[i]; 
            let node = this.state.grid[wall[0]][wall[1]];
            setTimeout(()=>{
                document.getElementById(`node-${node.row}-${node.col}`).className="node node-wall-animated";

            },i*this.state.mazeSpeed);
        }
    }


    render() {
        const { grid } = this.state;
       
        return (
            <React.Fragment>
            <Navbar

            visualizingAlgorithm={this.state.visualizingAlgorithm}
            visualizeAStar={this.visualizeAStar.bind(this)}
            visualizeDijkstra={this.visualizeDijkstra.bind(this)}
            visualizeBestFirstSearch={this.visualizeBestFirstSearch.bind(this)}
            visualizeBidirectionalSearch={this.visualizeBidirectionalSearch.bind(this)}
            visualizeBreadthFirstSearch={this.visualizeBreadthFirstSearch.bind(this)}
            visualizeDepthFirstSearch={this.visualizeDepthFirstSearch.bind(this)}
         
            clearGrid={this.clearGrid.bind(this)}
            clearPath={this.clearPath.bind(this)}
            clearweightsANDwalls = {this.clearweightsANDwalls.bind(this)}
            updateSpeed={this.updateSpeed.bind(this)}
            updateFeature={this.updateFeature.bind(this)}


            generatingMaze={this.state.generatingMaze}
            generateRandomMaze={this.generateRandomMaze.bind(this)}
            generateHorizontalMaze={this.generateHorizontalMaze.bind(this)}
            generateVerticalMaze={this.generateVerticalMaze.bind(this)}
            generateRecursiveDivisionMaze={this.generateRecursiveDivisionMaze.bind(this)}
            
            // generateHorizontalMaze={this.generateHorizontalMaze.bind(this)}
            
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
                                        onMouseEnter={(row, col) =>this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp(row,col)}
                                        onMouseLeave={(row,col) => this.handleMouseLeave(row,col)}></Node>
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

const getNewGridWithoutWallsAndWeights= (grid) =>{
    const newGrid = grid.slice()
    for(let row of grid){
        for(let node of row){
        if(node.hasWeight){
            const newNode = {
                ...node,
                hasWeight:false,
            };
            newGrid[node.row][node.col] = newNode;

        }
        if(node.isWall && (node.col !== grid.length[0] && node.row !== grid.length)){
            const newNode = {
                ...node,
                isWall:false,
            };
            newGrid[node.row][node.col] = newNode;
        }
    }
    }
    return newGrid;
}

const getNewGridWithoutPath = (grid)=> {
    const newGrid = grid.slice();
    for(let row of grid){
        for(let node of row){
            const newNode = {
                ...node,
                distance: Infinity,
                totalDistance: Infinity,
                isVisited: false,
                isShortest: false,
                previousNode: null,
            };
            newGrid[node.row][node.col] = newNode;

        }
    }
   
    return newGrid;
}

const getNewGridWithStartNodeToggled = (grid, row,col) =>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart:!node.isStart,
    };
    newGrid[row][col] = newNode;
    return newGrid;

}

const getNewGridWithFinishNodeToggled = (grid, row,col) =>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isFinish:!node.isFinish,
    };
    newGrid[row][col] = newNode;
    return newGrid;

}

const getNewGridWithMaze = (grid, walls)=>{
const newGrid = grid.slice();
for(let wall of walls){
    const node = grid[wall[0]][wall[1]];
    const newNode = {
        ...node,
        isWall:true,
    }
    newGrid[wall[0]][wall[1]] = newNode;
}
return newGrid;

}