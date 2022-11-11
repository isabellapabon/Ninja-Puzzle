import {BOXSIZE, KEYSIZE, KEYOFFSET, OFFSET} from '../const.js'
import {Square} from '../boundary/boundary.js';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers.js';

export class MoveType{
    constructor(dr, dc, direction){
        this.deltar = dr;
        this.deltac = dc;
        this.direction = direction;
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
    getCoordinateForDirection(direction){
        let row = this.row + direction.deltar;
        let column = this.column + direction.deltac;
        return new Coordinate(row, column);
    }

    isEqual(coordinate){
        return this.row === coordinate.row && this.column === coordinate.column;
    }
}

export class Cell {
    constructor(row, column, color = 'clear'){
        this.row = row;
        this.column = column;
        this.color = color;
    }
    location() {
        return new Coordinate(this.row, this.column);
    }
    whatType() {
        return 'cell';
    }

    place(row, column) {
        this.row = row;
        this.column = column;
    }
    compute() {
        let c = this.location();
        if(this.whatType() === 'key'){
            return new Square(BOXSIZE*c.column - KEYOFFSET + KEYSIZE, BOXSIZE*c.row - KEYOFFSET + KEYSIZE, BOXSIZE - 2*KEYOFFSET - KEYSIZE, BOXSIZE - 2*KEYOFFSET - KEYSIZE)
        }
        return new Square(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, BOXSIZE - 2*OFFSET, BOXSIZE - 2*OFFSET)
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        let sq = this.compute();
        ctx.beginPath();
        ctx.rect(sq.x, sq.y, sq.size, sq.size);
        ctx.fill();   
    }
}

export class Ninjase extends Cell {
    constructor(row, column){
        super(row, column, 'purple')
        this.key = null;
    }
    move(cell, direction) {
        if(this.canMoveTo(cell)) {
            this.row += direction.deltar;
            this.column += direction.deltac;
            return true;
        }
        return false;
    }

    haveKey(){
        return(this.key != null);
    }

    getKeyMessage(){
        if(this.haveKey()){
            return "Holding " + this.key.getColor() + " key";
        }
        return "Holding no key";
    }

    pickUpKey(key){
        let previousKey = this.key;
        key.swap(previousKey);
        this.key = key;
        return previousKey;
    }

    canMoveTo(cell){
        if(cell.whatType() === 'cell' ||
            cell.whatType() === 'key'){
            return true;
        }
        if(cell.whatType() === 'door'){
            if(cell.unlock(this.key)){
                this.key = null;
                return true;
            }
            return false;
        }
        return false;
    }
}

export class Wall extends Cell{
    constructor(row, column){
        super(row, column, 'black');
    }
    whatType(){
        return 'wall';
    }
}

export class Door extends Cell{
    constructor(color, row, column){
        super(row, column, color);
        this.locked = true;
        this.type = 'door';
    }
    isLocked(){
        return this.locked;
    }
    unlock(key){
        if(key === null){
            return false;
        }
        if(key.getColor() === this.color){
            this.locked = false;
            this.type = 'unlocked';
            return true;
        }
        return false;
    }
    whatType(){
        return this.type;
    }
}

export class Key extends Cell{
    constructor(color, row, column){
        super(row, column, color);
        this.type = 'key';
    }
    swap(previousKey){
        this.type = 'cell';
        if(previousKey != null){
            previousKey.type = 'key';
            previousKey.row = this.row;
            previousKey.column = this.column;
        }
    }
    getColor(){
        return this.color;
    }
    whatType(){
        return this.type;
    }

}

// Model knows level and puzzle
export class Model {
    // info is a json encoded puzzle
    constructor(level){
        this.initialize(level);
    }

    initialize(level){
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
    
        this.numMoves = 0;
        this.victory = false;
        this.showLabels = false;
        this.ninjase = ninjase;
        this.doors = doors;
        this.keys = keys;
        this.walls = walls;
        this.nr = level.rows;
        this.nc = level.columns;
        this.currentLevel = level;

        this.cells = [];

    //this is where you would create the nr x nc Cell objects
        for(let row = 0; row < this.nr; row++){
            this.cells[row] = [];
            for(let column = 0; column < this.nc; column++){
                this.cells[row][column] = new Cell(row, column);
            }
        }
    }

    numberMoves(){
        return this.numMoves;
    }

    ninjaMove(direction){
        
        let cell = this.getCell(direction)
        if(cell === undefined){
            return false;
        }
        if(this.ninjase.move(cell, direction))
        {
            if(cell.whatType() === 'unlocked'){
                for(let i = 0; i < this.doors.length; i++){
                    let door = this.doors[i];
                    if(cell.location().isEqual(door.location())){
                       this.doors.splice(i,1);
                       break;
                    }
                }
            }
            this.numMoves++;
        }
        return false;
    }


    getCell(direction){
        let location = this.ninjase.location();
        let directionCoordinate = location.getCoordinateForDirection(direction);

        for(let i = 0; i < this.doors.length; i++){
            let door = this.doors[i];
            if(door.location().isEqual(directionCoordinate)){
                return door;
            }
        }

        for(let i = 0; i < this.walls.length; i++){
            let wall = this.walls[i];
            if(wall.location().isEqual(directionCoordinate)){
                return wall;
            }
        }

        for(let i = 0; i < this.keys.length; i++){
            let key = this.keys[i];
            if(key.location().isEqual(directionCoordinate)){
                return key;
            }
        }

        return this.cells[directionCoordinate.row][directionCoordinate.column];
    }

    pickUpKey(){
        for(let i = 0; i < this.keys.length; i++){
            let key = this.keys[i];
            if(this.ninjase.location().isEqual(key.location())){
               let previousKey = this.ninjase.pickUpKey(key);
               this.numMoves++;
               if(previousKey != null){
                    this.keys.push(previousKey);
               }
               this.keys.splice(i,1);
               break;
            }
        }
    }

    getVictoryMessage(){
        if(this.doors.length != 0){
            return ""
        }
        return "Yay you solved it! Level completed."
    }
}