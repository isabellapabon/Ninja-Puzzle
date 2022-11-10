import {BOXSIZE, OFFSET} from '../const.js'

// Represents a square
export class Square {
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
    }
}

export function computeSquare(cell){
    return new Square(BOXSIZE*cell.column + OFFSET, BOXSIZE*cell.row + OFFSET, BOXSIZE - 2*OFFSET, BOXSIZE-2*OFFSET)
}

/* Method that redraws entire canvas from model. */
export function redrawCanvas(model, canvasObj) {
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0,0, canvasObj.width, canvasObj.height);

    // showing outermost information 
    let nr = model.nr
    let nc = model.nc

    ctx.fillStyle = 'black'

    for(let row = 0; row < nr; row++){
        for(let column = 0; column < nc; column++){
            let cell = model.cells[row][column]
            let sq = computeSquare(cell)
            // Heres you draw everything that you know about cell
            ctx.beginPath();
            ctx.rect(sq.x, sq.y, sq.size, sq.size);
            ctx.stroke();
        }
    }

    model.ninjase.draw(ctx);
    model.doors.forEach(door => { 
        door.draw(ctx);
    });

    model.keys.forEach(key => {
        key.draw(ctx);
    });

    model.walls.forEach(wall =>{
        wall.draw(ctx);
    });

}
