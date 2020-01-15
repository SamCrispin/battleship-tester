const board = [];
const BOARD_SIZE = 10;
const CELL_SIZE = 20;
let hits = 0;
let shots = 0;
let results = [];
let count = 0;
let limit = 100000;
let huntMode = true;
let moveStack = new Set();
let maxDensity = {val: 0};

const SHIP_LENGTHS = [2, 3, 3, 4, 5]; 

const easy = () => {
    let x, y;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    } while (board[y][x].hit);
    return {x, y};
};

const med = () => {
    let pos, moves;

    if (huntMode) {
        pos = easy();
        if (board[pos.y][pos.x].ship > 0) huntMode = false;
    } else {
        moves = Array.from(moveStack);
        do {
            pos = moves.pop();
        } while (typeof pos != "undefined" && board[pos.y][pos.x].hit == true);
        moveStack = new Set(moves);

        if (typeof pos === "undefined") {
            huntMode = true;
            pos =  easy();
        }
    }

    if (board[pos.y][pos.x].ship > 0) {
        if (board[pos.y + 1] && board[pos.y + 1][pos.x] && !board[pos.y + 1][pos.x].hit) moveStack.add({x: pos.x, y: pos.y + 1});
        if (board[pos.y] && board[pos.y][pos.x + 1] && !board[pos.y][pos.x + 1].hit) moveStack.add({x: pos.x + 1, y: pos.y});
        if (board[pos.y - 1] && board[pos.y - 1][pos.x] && !board[pos.y - 1][pos.x].hit) moveStack.add({x: pos.x, y: pos.y - 1});
        if (board[pos.y] && board[pos.y][pos.x - 1] && !board[pos.y][pos.x - 1].hit) moveStack.add({x: pos.x - 1, y: pos.y});
    }
    return {x: pos.x, y: pos.y};
};

const calcDensity = () => {
    let valid = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j].density = 0;
        }
    }
    maxDensity.val = 0;

    for (let ship of SHIP_LENGTHS) {
        if (!ship) continue;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j].hit) continue;
                for (let dir = 0; dir < 2; dir++) {
                    for (let l = 0; l < ship; l++) {
                        valid = true;
                        if (dir) {
                            //horizontal
                            if (ship + j > BOARD_SIZE || board[i][j+l].hit) {
                                valid = false;
                                break;
                            }
                        } else {
                            if (ship + i > BOARD_SIZE || board[i+l][j].hit) {
                                valid = false;
                                break;
                            }
                        }
                    }
                    if (valid) {
                        for (let l = 0; l < ship; l++) {
                            if (dir) {
                                if (board[i][j+l].density++ > maxDensity.val) {
                                    maxDensity.val = board[i][j+l].density;
                                    maxDensity.x = j + l;
                                    maxDensity.y = i;
                                }
                            } else {
                                if (board[i+l][j].density++ > maxDensity.val) {
                                    maxDensity.val = board[i+l][j].density;
                                    maxDensity.x = j;
                                    maxDensity.y = i + l;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const hard = () => {
    let x, y;
    let t = new Date();
    calcDensity();
    console.log(new Date() - t);
    return {x, y};
};

const DIFFICULTY = {
    "EASY": easy,
    "MED": med,
    "HARD": hard
};

const initBoard = () => {
    for (let i = 0; i  < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = {ship: 0, hit: false, sunk: false, density: 0};
        }
    }
};

const hardcodeBoard = () => {
    board[3][2].ship = 1;
    board[4][2].ship = 1;

    board[5][7].ship = 2;
    board[6][7].ship = 2;
    board[7][7].ship = 2;

    board[0][4].ship = 3;
    board[0][5].ship = 3;
    board[0][6].ship = 3;

    board[8][1].ship = 4;
    //board[8][1].hit = true;
    //board[8][1].sunk = true;
    board[8][2].ship = 4;
    //board[8][2].hit = true;
    //board[8][2].sunk = true;
    board[8][3].ship = 4;
    //board[8][3].hit = true;
    //board[8][3].sunk = true;
    board[8][4].ship = 4;
    //board[8][4].hit = true;
    //board[8][4].sunk = true;

    board[3][4].ship = 5;
    //board[3][4].hit = true;
    board[3][5].ship = 5;
    board[3][6].ship = 5;
    board[3][7].ship = 5;
    board[3][8].ship = 5;

    // board[0][0].hit = true;
    // board[0][5].hit = true;
    // board[0][9].hit = true;
    // board[1][1].hit = true;
    // board[1][3].hit = true;
    // board[2][7].hit = true;
    // board[2][9].hit = true;
    // board[3][0].hit = true;
    // board[3][2].hit = true;
    // board[3][8].hit = true;
    // board[4][2].hit = true;
    // board[4][4].hit = true;
    // board[4][8].hit = true;
    // board[5][1].hit = true;
    // board[5][4].hit = true;
    // board[5][5].hit = true;
    // board[5][6].hit = true;
    // board[5][9].hit = true;
    // board[6][2].hit = true;
    // board[6][5].hit = true;
    // board[6][8].hit = true;
    // board[7][7].hit = true;
    // board[7][9].hit = true;
    // board[8][4].hit = true;
    // board[9][1].hit = true;
    // board[9][2].hit = true;
    // board[9][4].hit = true;
    // board[9][6].hit = true;
    // board[9][8].hit = true;
    // board[9][9].hit = true;
};

const isShipSunk = (x, y) => {
    let ship = board[y][x].ship;
    for (let i = Math.max(y - SHIP_LENGTHS[ship-1], 0); i < Math.min(y + SHIP_LENGTHS[ship-1], BOARD_SIZE); i++) {
        if (board[i][x].ship === ship && board[i][x].hit === false) return;
    }
    for (let j = Math.max(x - SHIP_LENGTHS[ship-1], 0); j < Math.min(x + SHIP_LENGTHS[ship-1], BOARD_SIZE); j++) {
        if (board[y][j].ship === ship && board[y][j].hit === false) return;
    }

    for (let i = Math.max(y - SHIP_LENGTHS[ship-1], 0); i < Math.min(y + SHIP_LENGTHS[ship-1], BOARD_SIZE); i++) {
        if (board[i][x].ship === ship) board[i][x].sunk = true
    }
    for (let j = Math.max(x - SHIP_LENGTHS[ship-1], 0); j < Math.min(x + SHIP_LENGTHS[ship-1], BOARD_SIZE); j++) {
        if (board[y][j].ship === ship) board[y][j].sunk = true;
    }
    SHIP_LENGTHS[ship] = null;
};

const cpuShoot = (difficulty) => {
    let pos = difficulty();
    board[pos.y][pos.x].hit = true;
    shots++;
    if (board[pos.y][pos.x].ship > 0) {
        isShipSunk(pos.x, pos.y);
        hits++;
    }
    calcDensity();
};

const test = (difficulty) => {
    results = [];
    for (count = 0; count < limit;) {
        if (hits < 17) {
            cpuShoot(difficulty);
        } else {
            if (results[shots]) results[shots]++;
            else results[shots] = 1;
            if (shots > 100) finalLogs.push(logs);
            logs = [];
            hits = 0;
            shots = 0;
            huntMode = true;
            moveStack = new Set();
            initBoard();
            hardcodeBoard();
            count++;
        }
    }
};

function setup() {
    createCanvas(400, 400);
    initBoard();
    hardcodeBoard();
    calcDensity();
}

function draw() {
    for (let i = 0; i  < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].hit && board[i][j].sunk) fill(0 ,255, 0);
            else if (board[i][j].hit) fill(0, 0, 255);
            else fill(map(board[i][j].density, 0, maxDensity.val, 255, 32));
            strokeWeight(3);
            square(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE);
        }
    }
}