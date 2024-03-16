import { SseOfflineManager } from "../sse/SseOfflineManager.js";
import { GamePvE } from "./GamePvE.js";


export class GamePvEOfflineRoom {

    matchId;
    gamePve;
    timeToMove;
    timeToMoveIntervalId;

    constructor(matchId) {
        this.matchId = matchId;
        this.gamePve = new GamePvE();
        this.timeToMove = 30;
    }

    handleLeftClick(position) {
        this.gamePve.handleLeftClick(position);
        if (!this.timeToMoveIntervalId) {
            this.startTimer();
        }
        this.timeToMove = 30;
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
        this.stopTimer();
        this.timeToMoveIntervalId = null;
        this.timeToMove = 30;
        this.gamePve.reset();
    }

    handleLevelChange(level) {
        this.stopTimer();
        this.timeToMoveIntervalId = null;
        this.timeToMove = 30;
        this.gamePve.changeLevel(level);
    }

    /**************************************************/

    hasGameFinished() {
        if (this.gamePve.hasFinished) {
            this.stopTimer();
            const data = {
                status: this.gamePve.status,
                score: this.gamePve.score,
                time: this.gamePve.time,
            }
            //SseManager.sendEvent(this.player.id, 'game-finished', data);

            SseOfflineManager.sendEvent(this.matchId, 'game-finished', data);
        }
    }

    finishGameByTimeToMove() {
        this.gamePve.forceFinish();
        const data = {
            status: this.gamePve.status,
            score: this.gamePve.score,
            time: this.gamePve.time,
        }
        this.stopTimer();
        //SseManager.sendEvent(this.player.id, 'lost-by-time', data);

        SseOfflineManager.sendEvent(this.matchId, 'lost-by-time', data);
    }

    startTimer() {
        this.timeToMoveIntervalId = setInterval(() => {
            this.timeToMove--;
            if (this.timeToMove === 0) {
                this.finishGameByTimeToMove();
                this.stopTimer();
            }
        }, 1 * 1000);
    }

    stopTimer() {
        clearInterval(this.timeToMoveIntervalId);
    }
}