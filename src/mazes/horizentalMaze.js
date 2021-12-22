

export function horizontalMaze(grid){

    let walls =[];
    for(let i =0;i<grid.length;i++){
        for(let j=0;j<grid[0].length;j++){
            if(grid[i][j].isStart || grid[i][j].isFinish)continue;
            if(i==0 || i==grid.length-1 || j==0 || j==grid[0].length-1)walls.push([i,j]);

        }
    }
    for(let i =0; i< grid.length;i+=2){
        let random = Math.floor(Math.random()*(grid[0].length-2)+1);
        for(let j=0; j<grid[0].length; j++){
            if(grid[i][j].isStart || grid[i][j].isFinish)continue;

            if (j !==random){
                walls.push([i, j])
            }
           
        }
    }
    
    return walls;






}