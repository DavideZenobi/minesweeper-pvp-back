import { CORRECT_FLAGGED_CELL_SCORE, OPEN_CELL_SCORE, calculateTimeMultiplier } from "../utils/ScoreConstants.js";
import { minesweeperconfigs } from "../utils/minesweeperconfigs.js";


export class GamePvP {

    level;
    gameNumber;
    config;
    cells;
    minesLeft;
    alreadyFirstClicked;
    cellsToSend;
    flaggedCellToSend;
    startTimestamp;
    finishTimestamp;
    totalTime;
    visitedBlankCells;
    hasFinished;
    score;
    boardCompleted;

    constructor(level, gameNumber) {
        this.level = level;
        this.gameNumber = gameNumber;
        this.config = minesweeperconfigs[this.level];
        this.cells = Array.from({ length: this.config.squaresPerHeight }, (_unused, rowIndex) =>
            Array.from({ length: this.config.squaresPerWidth }, (__unused, colIndex) => (
                {
                    isMine: false,
                    isOpen: false,
                    isFlagged: false,
                    neighborMines: 0,
                    position: {
                        rowIndex: rowIndex,
                        colIndex: colIndex
                    }
                }
            ))
        );
        this.minesLeft = this.config.minesQuantity;
        this.alreadyFirstClicked = false;
        this.cellsToSend = new Array();
        this.visitedBlankCells = new Array();
        this.hasFinished = false;
        this.score = 0;
    }

    handleLeftClick(position) {
        if (!this.cells[position.rowIndex][position.colIndex].isFlagged) {
            if (this.alreadyFirstClicked) {
                this.openCell(position);
                this.checkBlankCell(position);
            } else {
                this.handleFirstLeftClick(position);
                this.alreadyFirstClicked = true;
            }

            this.hasGameFinished();
        }
    }

    handleRightClick(position) {
        if (this.alreadyFirstClicked) {
            this.flagCell(position);
        }
    }

    handleFirstLeftClick(position) {
        this.openStarterArea(position);
        this.generateMines();
        this.countNeighborMines();
        this.modifyCellsToSend();
        this.checkBlankCell(position);
    }

    resetCellsToSend() {
        this.cellsToSend = new Array();
    }

    openCell(position) {
        this.cells[position.rowIndex][position.colIndex].isOpen = true;
        this.addCellToCellsToSend(this.cells[position.rowIndex][position.colIndex]);
    }

    flagCell(position) {
        this.cells[position.rowIndex][position.colIndex].isFlagged = !this.cells[position.rowIndex][position.colIndex].isFlagged;
        if (this.cells[position.rowIndex][position.colIndex].isFlagged) {
            this.minesLeft--;
        } else {
            this.minesLeft++;
        }
        this.addCellToCellsToSend(this.cells[position.rowIndex][position.colIndex]);
    }

    checkBlankCell(position) {
        // Control de los límites del tablero
        if (position.rowIndex < 0 || position.rowIndex >= this.config.squaresPerHeight || position.colIndex < 0 || position.colIndex >= this.config.squaresPerWidth) {
            return;
        }

        // Control de si es una mina o no está en blanco
        if (this.cells[position.rowIndex][position.colIndex].isMine || this.cells[position.rowIndex][position.colIndex].neighborMines !== 0) {
            return;
        }

        // Controlar si ya se ha gestionado antes esta casilla en blanco
        for (const visited of this.visitedBlankCells) {
            if (visited.x === position.rowIndex && visited.y === position.colIndex) {
                return;
            }
        }

        this.visitedBlankCells.push({x: position.rowIndex, y: position.colIndex});

        for(let x = position.rowIndex - 1; x <= position.rowIndex + 1; x++) {
            for (let y = position.colIndex - 1; y <= position.colIndex + 1; y++) {
                if (x >= 0 && x < this.config.squaresPerHeight && y >= 0 && y < this.config.squaresPerWidth) {
                    this.cells[x][y].isOpen = true;
                    this.addCellToCellsToSend(this.cells[x][y]);
                    this.checkBlankCell({rowIndex: x, colIndex: y});
                }
            }
        }
    }

    hasGameFinished() {
        const isLost = this.cells.flat().some(cell => cell.isMine && cell.isOpen);
        const noMineCells = this.cells.flat().filter(cell => !cell.isMine);
        const isWon = noMineCells.every(cell => cell.isOpen);
        
        if (isLost) {
            this.boardCompleted = false;
        } else if (isWon) {
            this.boardCompleted = true;
        }

        if (isLost || isWon) {
            this.hasFinished = true;
            this.finishTimestamp = Date.now();
            this.totalTime = Math.round((this.finishTimestamp - this.startTimestamp) / 1000);
            this.processScore();
        }
    }

    forceFinishByTime() {
        this.boardCompleted = false;
        this.hasFinished = true;
        this.finishTimestamp = Date.now();
        this.totalTime = Math.round((this.finishTimestamp - this.startTimestamp) / 1000);
        this.processScore();
    }

    addCellToCellsToSend(cell) {
        let needToPush = true;

        this.cellsToSend.forEach((modifiedCell, index) => {
            if (modifiedCell.position.rowIndex === cell.position.rowIndex && modifiedCell.position.colIndex === cell.position.colIndex) {
                this.cellsToSend[index] = {...modifiedCell, ...cell};
                needToPush = false;
            }
        });

        if (needToPush) {
            this.cellsToSend.push(cell);
        }
    }

    // When the game is running, return actual time in seconds
    getActualTime() {
        return Math.floor((Date.now() - this.startTimestamp) / 1000);
    }

    /****************************************************************
    ** 
    ** Methods called only once per game
    ** 
    ****************************************************************/

    generateMines() {
        let minesPlaced = 0;

        while (minesPlaced < this.config.minesQuantity) {
            const randomRow = Math.floor(Math.random() * this.config.squaresPerHeight);
            const randomCol = Math.floor(Math.random() * this.config.squaresPerWidth);

            if (!this.cells[randomRow][randomCol].isOpen && !this.cells[randomRow][randomCol].isMine) {
                this.cells[randomRow][randomCol].isMine = true;
                minesPlaced++;
            }
        }
    }

    countNeighborMines() {
        for (let x = 0; x < this.config.squaresPerHeight; x++) {
            for (let y = 0; y < this.config.squaresPerWidth; y++) {
                if (!this.cells[x][y].isMine) {
                    let counter = 0;
                    for (let newX = x - 1; newX <= x + 1; newX++) {
                        if (newX >= 0 && newX < this.config.squaresPerHeight) {
                            for(let newY = y - 1; newY <= y + 1; newY++) {
                                if (newY >= 0 && newY < this.config.squaresPerWidth) {
                                    if (this.cells[newX][newY].isMine) {
                                        counter++;
                                    }
                                }
                            }
                        }
                    }
                    this.cells[x][y].neighborMines = counter;
                }
            }
        }
    }

    // Solo se llama 1 vez, despues de que se hayan setteado las el numero de minas vecinas
    modifyCellsToSend() {
        this.cells.forEach((xCells) => {
            xCells.forEach(cell => {
                this.cellsToSend.forEach((cellToSend, index) => {
                    if (cell.position.rowIndex === cellToSend.position.rowIndex && cell.position.colIndex === cellToSend.position.colIndex) {
                        this.cellsToSend[index] = cell;
                    }
                })
            })
        });
    }

    openStarterArea(position) {
        // -1 +1 en caso de que la zona que se abre sea 3x3
        // -2 +2 5x5
        // -3 +3 7x7
        for (let x = position.rowIndex - 1; x <= position.rowIndex + 1; x++) {
            if (x >= 0 && x < this.config.squaresPerHeight) {
                for (let y = position.colIndex - 1; y <= position.colIndex + 1; y++) {
                    if (y >= 0 && y < this.config.squaresPerWidth) {
                        this.cells[x][y].isOpen = true;
                        this.addCellToCellsToSend(this.cells[x][y]);
                    }
                }
            }
        }
    }

    processScore() {
        let timeMultiplier = 1;
        if (this.boardCompleted) {
            timeMultiplier = calculateTimeMultiplier(this.level, this.totalTime);
        }

        let openedCellsCounter = 0;
        let correctFlaggedMinesCounter = 0;
        this.cells.forEach((row) => {
            row.forEach(cell => {
                if (cell.isOpen && !cell.isMine) {
                    openedCellsCounter++;
                } else if (!cell.isOpen && cell.isFlagged && cell.isMine) {
                    correctFlaggedMinesCounter++;
                }
            })
        });

        const score = ((openedCellsCounter * OPEN_CELL_SCORE) + (correctFlaggedMinesCounter * CORRECT_FLAGGED_CELL_SCORE)) * timeMultiplier;
        this.score = Math.ceil(score);
    }

    /*********************************************************************************************/

}