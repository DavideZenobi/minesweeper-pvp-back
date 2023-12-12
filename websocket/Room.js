import { CORRECT_FLAGGED_CELL_SCORE, OPEN_CELL_SCORE, calculateTimeMultiplier } from "../utils/ScoreConstants.js";

const roomStatusEnum = {
    pending: 'pending', // Waiting for users to accept it
    ready: 'ready', // Countdown started
    waiting: 'waiting', // Server needs to do things
    running: 'running', // Currently playing
    finished: 'finished', // Match finished
    toDestroy: 'toDestroy', // Ready to delete
}

const userStatusEnum = {
    pending: 'pending',
    accept: 'accept',
    waiting: 'waiting',
    ready: 'ready',
    readyNext: 'readyNext',
    decline: 'decline',
    exited: 'exited',
}

export class Room {
    io;
    roomId; // UUIDv4
    usersAndSockets = new Array(); // userId, username, socket
    currentGameNumber;
    roomStatus;
    matchConfig;
    playersResults = new Array(); // [ { username: string, wins: number, results: [ { gameNumber: number, openedCells: number, correctFlaggedCells: number, score: number, time: number } ] } ]
    finalWinner;

    constructor(io, roomId, userIdsAndSockets) {
        this.io = io;
        this.roomId = roomId;
        this.usersAndSockets = userIdsAndSockets;
        this.currentGameNumber = 1;

        const dataToSend = new Array();

        this.usersAndSockets.forEach(userAndSocket => {
            userAndSocket = {...userAndSocket, status: 'pending'};
            dataToSend.push({userId: userAndSocket.userId, username: userAndSocket.username, status: userAndSocket.status});
            userAndSocket.socket.join(this.roomId);

            this.playersResults.push({
                username: userAndSocket.username,
                wins: 0,
                results: new Array(),
            });
        });

        this.roomStatus = roomStatusEnum.pending;
        
        this.sendEvent('match-founded', dataToSend);
    }

    initializeListeners() {
        this.usersAndSockets.forEach(userAndSocket => {
            // Listener que gestiona si el jugador ha aceptado o rechazado la partida
            userAndSocket.socket.on('match-action-selected', (status) => {
                userAndSocket.status = status;
                this.sendBroadcastEvent(userAndSocket.socket, 'update-user-action', {userId: userAndSocket.userId, newStatus: userAndSocket.status});
                this.haveUsersAccepted();
            });

            // Listener para saber si el usuario ya ha renderizado la pantalla de la partida y dar comienzo al partido
            userAndSocket.socket.on('user-ready', () => {
                userAndSocket.status = userStatusEnum.ready;
                this.areUsersReady();
            });

            // Listener para saber si ha terminado el tiempo de reseteo para la siguiente partida
            userAndSocket.socket.on('user-ready-next', () => {
                userAndSocket.status = userStatusEnum.readyNext;
                const areUsersReady = this.areUsersReadyForNext();
                if (areUsersReady && this.roomStatus != roomStatusEnum.finished) {
                    this.sendEvent('all-users-ready-next');
                }
            });

            // Listener para saber si el usuario ha terminado la partida
            // Si todos los usuarios han terminado, se procesan los datos
            userAndSocket.socket.on('user-finished-game', (data) => { // Data object: {cells, time}
                userAndSocket.status = userStatusEnum.waiting;
                const score = this.processScore(data);
                this.addUserGameResult({ username: userAndSocket.username, score: score, data: data });
                const result = this.haveUsersFinishedGame();
                if (result) {
                    this.sendGameResult();
                    const isMatchFinished = this.isMatchFinished();
                    if (isMatchFinished) {
                        this.sendEvent('match-finished');
                    } else {
                        this.sendEvent('all-users-finished-game');
                        this.currentGameNumber++;
                    }
                }
            });

            userAndSocket.socket.on('board-update', (data) => {
                this.sendBroadcastEvent(userAndSocket.socket, 'opponent-board-update', data);
            });

            // Listener para gestionar si un jugador se ha salido antes de terminar la partida
            userAndSocket.socket.on('player-left', () => {
                userAndSocket.status = userStatusEnum.exited;
                this.sendBroadcastEvent(userAndSocket.socket, 'player-left', { username: userAndSocket.username });
            });

            userAndSocket.socket.on('player-left-correctly', () => {
                userAndSocket.status = userStatusEnum.exited;
                const result = this.haveUsersExitedRoom();
                if (result) {
                    this.roomStatus = roomStatusEnum.toDestroy;
                }
            });

            userAndSocket.socket.on('disconnect', () => {
                userAndSocket.status = userStatusEnum.exited;
                // TODO
            });
        });
    }

    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

    // Cuando todos los jugadores hayan aceptado la partida
    haveUsersAccepted() {
        const accept = this.usersAndSockets.every(userAndSocket => userAndSocket.status === userStatusEnum.accept);
        if (accept) {
            this.sendEvent('all-users-accepted', {roomId: this.roomId});
            this.setRoomStatus(roomStatusEnum.waiting);
        }
    }

    // Cuando todos los jugadores hayan entrado en la sala
    areUsersReady() {
        const ready = this.usersAndSockets.every(userAndSocket => userAndSocket.status === userStatusEnum.ready);
        if (ready) {
            this.sendEvent('all-users-ready-to-start');
            this.setRoomStatus(roomStatusEnum.ready);
        }
    }

    // Controla si todos los jugadores están listos para la siguiente partida || Se ha terminado el tiempo de reseteo
    areUsersReadyForNext() {
        const readyNext = this.usersAndSockets.every(userAndSocket => userAndSocket.status === userStatusEnum.readyNext);
        return readyNext;
    }

    // Controla si todos los jugadores han terminado la partida. Si es true, se hacen los controles necesarios
    haveUsersFinishedGame() {
        const haveUsersFinished = this.usersAndSockets.every(userAndSocket => userAndSocket.status === userStatusEnum.waiting);
        return haveUsersFinished;
    }

    haveUsersExitedRoom() {
        const result = this.usersAndSockets.every(userAndSocket => userAndSocket.status === userStatusEnum.exited);
        return result;
    }

    // Cuando un jugador termina su partida, se guarda el resultado
    addUserGameResult({ username, score, data }) {
        let openedCells = 0;
        let correctFlaggedCells = 0;
        data.cells.forEach(row => {
            row.forEach(cell => {
                if (cell.isOpen && !cell.isMine) {
                    openedCells++;
                } else if (!cell.isOpen && cell.isFlagged && cell.isMine) {
                    correctFlaggedCells++;
                }
            })
        });

        const index = this.playersResults.findIndex(playerResults => playerResults.username === username);
        this.playersResults[index].results.push({
            gameNumber: this.currentGameNumber,
            openedCells: openedCells,
            correctFlaggedCells: correctFlaggedCells,
            score: score,
            time: data.time,
        });
    }

    // Cuando todos los jugadores han terminado la partida, se controla quien ha ganado
    checkGameWinner() {
        const winnerUsername = this.playersResults.reduce((highest, currentPlayer) => {
            if (!highest || currentPlayer.results[this.currentGameNumber - 1].score > highest.results[this.currentGameNumber - 1].score) {
                return currentPlayer;
            } else {
                return highest;
            }
        }).username;
        
        const winnerIndex = this.playersResults.findIndex(playerResults => playerResults.username === winnerUsername);
        this.playersResults[winnerIndex].wins++;

        return winnerUsername;
    }

    // Controla si el partido se ha terminado
    isMatchFinished() {
        let isMatchFinished = false;
        for (const playerResult of this.playersResults) {
            if (playerResult.wins >= 2) {
                this.roomStatus = roomStatusEnum.finished;
                isMatchFinished = true;
                this.finalWinner = playerResult.username;
                break;
            }
        }

        return isMatchFinished;
    }

    processScore(data) {
        let timeMultiplier = 1;
        const notMineCells = data.cells.flat().filter(cell => !cell.isMine);
        const areAllCellsOpen = notMineCells.every(cell => cell.isOpen);
        if (areAllCellsOpen) {
            timeMultiplier = calculateTimeMultiplier(data.time);
        }

        let openedCellsCounter = 0;
        let correctFlaggedMinesCounter = 0;
        data.cells.forEach((row) => {
            row.forEach(cell => {
                if (cell.isOpen) {
                    openedCellsCounter++;
                } else if (!cell.isOpen && cell.isFlagged && cell.isMine) {
                    correctFlaggedMinesCounter++;
                }
            })
        });
        
        const score = ((openedCellsCounter * OPEN_CELL_SCORE) + (correctFlaggedMinesCounter * CORRECT_FLAGGED_CELL_SCORE)) * timeMultiplier;
        const roundedScore = Math.ceil(score);
        return roundedScore;
    }

    // Cuando todos los usuarios hayan terminado la partida, se determina quien ha ganado
    sendGameResult() {
        const gameWinnerUsername = this.checkGameWinner();
        this.sendEvent('game-result', this.playersResults);
    }

    setRoomStatus(roomStatus) {
        this.roomStatus = roomStatus;
    }

    // Envía mensaje a todos los usuarios de la sala excepto el emisor
    sendBroadcastEvent(socket, event, message) {
        socket.broadcast.to(this.roomId).emit(event, message);
    }

    // Envía mensaje a todos los usuarios de la sala
    sendEvent(event, message) {
        this.io.to(this.roomId).emit(event, message);
    }

    // Envía mensaje a un usuario
    sendPersonalEvent(socket, event, message) { 
        this.io.to(socket).emit(event, message);
    }

    // Devuelve la información de la sala
    // Array de players con id y username
    // Objeto matchConfig
    getInfo() {
        const info = { players: [], matchConfig: {} };
        this.usersAndSockets.forEach(user => {
            info.players.push({userId: user.userId, username: user.username, status: user.status});
        });

        info.matchConfig = this.matchConfig;

        return info;
    }
}