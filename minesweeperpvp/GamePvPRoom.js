import { minesweeperconfigs } from "../utils/minesweeperconfigs.js";
import { GamePvP } from "./GamePvP.js";
import { SseManager } from '../sse/SseManager.js';
import dayjs from "dayjs";

const userStatusEnum = {
    waitingToConnect: 'waitingToConnect',
    readyToStart: 'readyToStart',
    starting: 'starting',
    running: 'running',
    waiting: 'waiting',
    resetting: 'resetting',
    finished: 'finished',
}

const matchTypeEnum = {
    bo1: 1,
    bo3: 2,
    bo5: 3,
}

export class GamePvPRoom {
    
    matchId;
    status;
    usersGames = new Array(); // [{user, status, wins, timeToMove, timeToMoveIntervalId, [games], [results]}] games: GamePvP      results: {gameNumber, score, time}
    level;
    config;
    neededWins;
    winnerUsername;
    currentGameNumber;
    timerToStart;
    timerToStartIntervalId;
    timerToNextGame;
    timerToNextGameIntervalId;
    timeUpdaterIntervalId;
    datetimeMatchStarted;
    datetimeMatchFinished;

    constructor(matchId, players) {
        this.matchId = matchId;
        this.status = 'running';
        this.level = 'hard';
        this.config = minesweeperconfigs[this.level];
        this.neededWins = matchTypeEnum.bo3;
        this.currentGameNumber = 1;
        players.forEach(player => {
            this.usersGames.push({
                user: player,
                status: userStatusEnum.waitingToConnect,
                wins: 0,
                timeToMove: null,
                timeToMoveIntervalId: null,
                games: new Array(new GamePvP(this.level, this.currentGameNumber)),
                results: new Array(),
            });
        });
        this.datetimeMatchStarted = dayjs().format('YYYY-MM-DD HH:mm:ss');

    }

    // El usuario se ha conectado al match
    userConnects(userId) {
        const userGame = this.getCurrentUserGameByUser(userId);
        if (userGame.status === userStatusEnum.waitingToConnect) {
            userGame.status = userStatusEnum.readyToStart;
        }
    }
    
    isEveryoneReadyToStart() {
        const result = this.usersGames.every(userGame => userGame.status === userStatusEnum.readyToStart);
        if (result) {
            this.startMatch();
        }
    }

    // Si todos se han conectado, empieza el match
    startMatch() {
        this.startTimerToStart();
        this.startTimeUpdater();
        this.usersGames.forEach(userGame => {
            userGame.status = userStatusEnum.starting;
            SseManager.sendEvent(userGame.user.id, 'match-started', { message: this.timerToStart })
        });
    }

    // Empieza el game
    startGame() {
        this.usersGames.forEach(userGame => {
            userGame.status = userStatusEnum.running;
            SseManager.sendEvent(userGame.user.id, 'game-started');
            userGame.games[this.currentGameNumber - 1].startTimestamp = Date.now();
            this.startTimeToMove(userGame);
        });
    }

    // Gestiona el click izquierdo
    handleLeftClick(userId, position) {
        const userGame = this.getCurrentUserGameByUser(userId);
        if (userGame.status === userStatusEnum.running) {
            userGame.timeToMove = 30;
            userGame.games[this.currentGameNumber - 1].handleLeftClick(position);
            const cellsToSend = userGame.games[this.currentGameNumber - 1].cellsToSend;
            return cellsToSend;
        } else {
            return null;
        }
    }

    // Gestiona el click derecho
    handleRightClick(userId, position) {
        const userGame = this.getCurrentUserGameByUser(userId);
        if (userGame.status === userStatusEnum.running) {
            userGame.games[this.currentGameNumber - 1].handleRightClick(position);
            const cellsToSend = userGame.games[this.currentGameNumber - 1].cellsToSend;
            return cellsToSend;
        } else {
            return null;
        }
    }

    hasFinishedGame(userId) {
        const userGame = this.getCurrentUserGameByUser(userId);
        if (userGame.games[this.currentGameNumber - 1].hasFinished) {
            userGame.status = userStatusEnum.waiting;
            clearInterval(userGame.timeToMoveIntervalId);
            SseManager.sendEvent(userGame.user.id, 'game-finished');
            this.haveAllFinishedGame();
        }
    }

    sendUpdatedCellsToOpponent(userId) {
        const senderUserGame = this.getCurrentUserGameByUser(userId);
        this.usersGames.forEach(receiverUserGame => {
            if (receiverUserGame.user.id !== senderUserGame.user.id) {
                SseManager.sendEvent(receiverUserGame.user.id, 'update-opponents-cells', senderUserGame.games[this.currentGameNumber - 1].cellsToSend);
            }
        });
    }

    // Controla si todos los jugadores han terminado el game
    haveAllFinishedGame() {
        let counter = 0;
        this.usersGames.forEach(userGame => {
            if (userGame.games[this.currentGameNumber - 1].hasFinished) {
                counter++;
            }
        });

        if (counter === this.usersGames.length) {
            this.processAllFinishedGame();
        } 
    }

    processAllFinishedGame() {
        const winner = this.usersGames.reduce((max, userGame) => max.games[this.currentGameNumber - 1].score > userGame.games[this.currentGameNumber - 1].score ? max : userGame);
        winner.wins++;

        const dataToSend = new Array();
        let isMatchFinished = false;

        this.usersGames.forEach(userGame => {
            const result = {
                gameNumber: this.currentGameNumber,
                score: userGame.games[this.currentGameNumber - 1].score,
                time: userGame.games[this.currentGameNumber - 1].totalTime,
                winner: userGame.user.username === winner.user.username ? true : false,
            }
            userGame.results.push(result);

            const newDataToSend = {
                username: userGame.user.username,
                wins: userGame.wins,
                results: userGame.results,
            }
            dataToSend.push(newDataToSend);

            if (userGame.wins === this.neededWins) {
                this.winnerUsername = userGame.user.username;
                isMatchFinished = true;
            }
        });

        
        this.usersGames.forEach(userGame => {
            SseManager.sendEvent(userGame.user.id, 'all-games-finished', dataToSend);
        });

        if (isMatchFinished) {
            this.processMatchFinished();
        } else {
            this.usersGames.forEach(userGame => {
                userGame.status = userStatusEnum.resetting;
                SseManager.sendEvent(userGame.user.id, 'preparing-next-game');
            });
            this.startTimerToNextGame();
        }
    }

    processNextGame() {
        this.currentGameNumber++;
        this.usersGames.forEach(userGame => {
            userGame.status = userStatusEnum.starting;
            userGame.games.push(new GamePvP(this.level, this.currentGameNumber));
            SseManager.sendEvent(userGame.user.id, 'reset-game');
        });
        this.startTimerToStart();
    }

    processMatchFinished() {
        this.stopTimeUpdater();
        this.status = 'finished';
        this.datetimeMatchFinished = dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.usersGames.forEach(userGame => {
            SseManager.sendEvent(userGame.user.id, 'match-finished');
        });
    }

    getMatchConfig() {
        return this.config;
    }

    getUserStatus(userId) {
        const userGame = this.getCurrentUserGameByUser(userId);
        return userGame.status;
    }

    getCurrentUserGameByUser(userId) {
        return this.usersGames.find(userGame => userGame.user.id === userId);
    }

    // {status, userStatus, currentGame, time, timeToMove, cells, }
    getInfoForReconnectedUser(userId) {
        const users = new Array();
        this.usersGames.forEach(userGame => {
            users.push({username: userGame.user.username, wins: userGame.wins});
        });

        const userGame = this.getCurrentUserGameByUser(userId);

        let dataToSend;
        switch (userGame.status) {
            case userStatusEnum.readyToStart:
                dataToSend = {
                    users: users,
                    userStatus: userGame.status,
                }
                break;
            case userStatusEnum.starting:
                dataToSend = {
                    users: users,
                    userStatus: userGame.status,
                    currentGame: this.currentGameNumber,
                    timeToStart: this.timerToStart,
                }
                break;
            case userStatusEnum.running:
                dataToSend = {
                    users: users,
                    userStatus: userGame.status,
                    currentGame: this.currentGameNumber,
                    cells: userGame.games[this.currentGameNumber - 1].cellsToSend,
                    minesLeft: userGame.games[this.currentGameNumber - 1].minesLeft,
                    time: userGame.games[this.currentGameNumber - 1].getActualTime(),
                    timeToMove: userGame.timeToMove,
                }
                break;
            case userStatusEnum.waiting:
                dataToSend = {
                    users: users,
                    userStatus: userGame.status,
                    currentGame: this.currentGameNumber,
                    cells: userGame.games[this.currentGameNumber - 1].cellsToSend,
                    minesLeft: userGame.games[this.currentGameNumber - 1].minesLeft,
                    time: userGame.games[this.currentGameNumber - 1].totalTime,
                    timeToMove: userGame.timeToMove,
                }
                break;
            case userStatusEnum.resetting:
                const results = new Array();

                this.usersGames.forEach(userGame => {
                    const newObject = {
                        username: userGame.user.username,
                        wins: userGame.wins,
                        results: userGame.results
                    }
                    results.push(newObject);
                });
                
                dataToSend = {
                    users: users,
                    userStatus: userGame.status,
                    currentGame: this.currentGameNumber,
                    cells: userGame.games[this.currentGameNumber - 1].cellsToSend,
                    minesLeft: userGame.games[this.currentGameNumber - 1].minesLeft,
                    time: userGame.games[this.currentGameNumber - 1].totalTime,
                    timeToMove: userGame.timeToMove,
                    timeToNextGame: this.timerToNextGame,
                    results: results,
                }
                break;
            default:
                break;
        }

        return dataToSend;
    }

    sendUpdatedTime() {
        this.usersGames.forEach(userGame => {
            let data;
            switch (userGame.status) {
                case userStatusEnum.starting:
                    data = {
                        userStatus: userGame.status,
                        time: this.timerToStart
                    }
                    SseManager.sendEvent(userGame.user.id, 'updated-time', data);
                    break;
                case userStatusEnum.running:
                    data = {
                        userStatus: userGame.status,
                        time: userGame.games[this.currentGameNumber - 1].getActualTime(),
                        timeToMove: userGame.timeToMove,
                    }
                    SseManager.sendEvent(userGame.user.id, 'updated-time', data);
                    break;
                case userStatusEnum.resetting:
                    data = {
                        userStatus: userGame.status,
                        time: this.timerToNextGame,
                    }
                    SseManager.sendEvent(userGame.user.id, 'updated-time', data);
                    break;
                default:
                    break;
            }
        });
    }


    /**
     * 
     * TIMERS
     * 
     **/

    startTimeToMove(userGame) {
        userGame.timeToMove = 30;
        userGame.timeToMoveIntervalId = setInterval(() => {
            userGame.timeToMove--;
            if (userGame.timeToMove === 0) {
                clearInterval(userGame.timeToMoveIntervalId);
                userGame.games[this.currentGameNumber - 1].forceFinishByTime();
                this.hasFinishedGame(userGame.user.id);
            }
        }, 1 * 1000);
    }

    startTimerToStart() {
        this.timerToStart = 5;
        this.timerToStartIntervalId = setInterval(() => {
            this.timerToStart--;
            if (this.timerToStart === 0) {
                clearInterval(this.timerToStartIntervalId);
                this.startGame();
            }
        }, 1 * 1000);
    }

    startTimerToNextGame() {
        this.timerToNextGame = 20;
        this.timerToNextGameIntervalId = setInterval(() => {
            this.timerToNextGame--;
            if (this.timerToNextGame === 0) {
                clearInterval(this.timerToNextGameIntervalId);
                this.processNextGame();
            }
        }, 1 * 1000);
    }

    startTimeUpdater() {
        this.timeUpdaterIntervalId = setInterval(() => {
            this.sendUpdatedTime();
        }, 5 * 1000);
    }

    stopTimeUpdater() {
        clearInterval(this.timeUpdaterIntervalId);
    }
}