import { createGamePvE } from "../minesweeper/GamePvEFactory.js";
import { MatchesPvE } from "../minesweeper/MatchesPvE.js";


export class GamePvEController {

    static async create(req, res) {
        const user = req.session.user;
        createGamePvE(user);
        return res.status(200).end();
    }

    static async handleLeftClick(req, res) {
        const user = req.session.user;
        const position = req.body.position;
        const gameRoom = MatchesPvE.getGameRoomByUserId(user.id);
        const cellsToSend = gameRoom.handleLeftClick(position);
        res.status(200).json(cellsToSend);
        gameRoom.hasGameFinished();
    }

    static async handleRightClick(req, res) {
        const user = req.session.user;
        const position = req.body.position;
        const gameRoom = MatchesPvE.getGameRoomByUserId(user.id);
        const cellsToSend = gameRoom.handleRightClick(position);
        return res.status(200).json(cellsToSend);
    }

    static async reset(req, res) {

    }

    static async levelChange(req, res) {
        const user = req.session.user;
        const level = req.body.level;
        const gameRoom = MatchesPvE.getGameRoomByUserId(user.id);
        gameRoom.handleLevelChange(level);
    }

    static async delete(req, res) {
        MatchesPvE.deleteMatch(req.session.user.id);
        return res.status(200).end();
    }

}