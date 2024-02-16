import { SseManager } from "../sse/SseManager.js";
import { GamePvE } from "./GamePvE.js";


export class GamePvERoom {

    player;
    gamePve;
    timeToMove;
    timeToMoveIntervalId;
    started;

    constructor(player) {
        this.player = player;
        this.gamePve = new GamePvE();
        this.timeToMove = 30;
        this.started = false;
    }

    handleLeftClick(position) {
        if (!this.timeToMoveIntervalId) {
            this.startTimer();
        }

        this.gamePve.handleLeftClick(position);
        this.started = true;
        const cellsToSend = this.gamePve.cellsToSend;
        this.gamePve.resetCellsToSend();
        return cellsToSend;
    }

    handleRightClick(position) {
        this.gamePve.handleRightClick(position);
        const cellsToSend = this.gamePve.cellsToSend;
        this.gamePve.resetCellsToSend();
        return cellsToSend;
    }

    handleReset() {

    }

    handleLevelChange(level) {
        this.gamePve = new GamePvE(level);
    }

    hasGameFinished() {
        if (this.gamePve.hasFinished) {
            const data = {
                status: this.gamePve.status,
                score: this.gamePve.score,
                time: this.gamePve.time,
            }
            SseManager.sendEvent(this.player.id, 'game-finished', data);
        }
    }

    finishGameByTimeToMove() {
        this.gamePve.forceFinish();
        const data = {
            status: this.gamePve.status,
            score: this.gamePve.score,
            time: this.gamePve.time,
        }
        SseManager.sendEvent(this.player.id, 'lost-by-time', data);
    }

    startTimer() {
        this.timeToMoveIntervalId = setInterval(() => {
            this.timeToMove--;
            if (this.timeToMove === 0) {
                this.finishGameByTimeToMove();
                clearInterval(this.timeToMoveIntervalId);
            }
        }, 1 * 1000);
    }
}