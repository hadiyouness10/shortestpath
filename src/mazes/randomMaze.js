export function randomMaze(grid, startNode, EndNode){

    if (!startNode || !EndNode || startNode === EndNode) {
        return false;

      }

      let walls = [];
      for(let row=0; row<grid.length; row++){
          for(let col=0;col<grid[0].length;col++){
            if((row === startNode.row && col === startNode.col)|| (row === EndNode.row && col === EndNode.col)){
                continue;
            }

            if(Math.random() < 0.29){
                walls.push([row,col])
            }
          }
      }

      return walls;
}