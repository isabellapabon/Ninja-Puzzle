import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";
import {BOXSIZE, OFFSET} from '../const.js'
import {Square} from '../boundary/boundary.js';

export class MoveType{
    constructor(dr, dc){
        this.deltar = dr;
        this.deltac = dc;
    }
    static parse(s) {
        if ((s === "down") || (s === "Down")) {return Down;}
        if ((s === "up") || (s === "Up")) {return Up;}
        if ((s === "right") || (s === "Right")) {return Right;}
        if ((s === "left") || (s === "Left")) {return Left;}
        return NoMove;
    }
}

export const Down = new MoveType(1, 0, "down");
export const Up = new MoveType(-1, 0, "up");
export const Left = new MoveType(0, -1, "left");
export const Right = new MoveType(0, 1, "right");
export const NoMove = new MoveType(0, 0, "*");


export class Coordinate {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}


export class Ninjase {
    constructor(row, column, key){
        this.row = row;
        this.column = column;
        this.key = column;
    }
    location() {
        return new Coordinate(this.row, this.column);
    }
    compute(){
        let c = this.location();
        return new Square(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET)
    }
    draw(ctx) {
        ctx.fillStyle = 'purple'
        let sq = this.compute();
        ctx.beginPath();
        ctx.rect(sq.x, sq.y, sq.size, sq.size);
        ctx.fill();   
    }
    
}

export class Wall {
    constructor(row, column, color){
        this.row = row;
        this.column = column;
    }
    location() {
        return new Coordinate(this.row, this.column);
    }

}

export class Door {
    constructor(color, row, column){
        this.color = color;
        this.row = row;
        this.column = column;
    }
    location() {
        return new Coordinate(this.row, this.column);
    }
    
}

export class Key {
    constructor(row, column, color){

        this.color = color;
        this.row = row;
        this.column = column;
        
    }
    location() {
        return new Coordinate(this.row, this.column);
    }
    

}

export class Cell {
    constructor(row, column){
        this.row = row;
        this.column = column;
    }
}

export class Puzzle {
    constructor(nr, nc, ninjase, walls, doors, keys){
        this.nr = nr;
        this.nc = nc;
        this.ninjase = ninjase;
        this.walls = walls;
        this.doors = doors;
        this.keys = keys;

        this.cells = [];

    //this is where you would create the nr x nc Cell objects
        for(let row = 0; row < nr; row++){
            this.cells[row] = [];
            for(let column = 0; column < 5; column++){
                this.cells[row][column] = new Cell(row, column);
            }
        }
    }
}


// Model knows level and puzzle
export class Model {
    // info is a json encoded puzzle
    constructor(level){
        this.intialize(level);
    }

    intialize(level){
        let nr = level.rows;
        let nc = level.columns;
        let ninjase = new Ninjase(level.ninjase.row, level.ninjase.column);
        let walls = []
        let keys = []
        let doors = []

        level.walls.forEach((w) => {
            let wall = new Wall(w.row, w.column)
            walls.push(wall)
        })

        level.keys.forEach((k) => {
            let key = new Key(k.color, k.row, k.column)
            keys.push(key)
        })
       
        level.doors.forEach((d) => {
            let door = new Door(d.color, d.row, d.column)
            doors.push(door)
        })
    
        this.puzzle = new Puzzle(nr, nc, ninjase, walls, doors, keys);
        this.numMoves = 0;
        this.victory = false;
        this.showLabels = false;
        this.ninjase = ninjase;
        this.doors = doors;
    }
}