import { createGamePvEOffline } from "../minesweeper/GamePvEOfflineFactory.js";
import { MatchesPvEOffline } from "../minesweeper/MatchesPvEOffline.js";


export class GamePvEOfflineController {

    static async create(req, res) {
        //const user = req.session.user;
        const matchId = createGamePvEOffline();
        return res.status(200).json(matchId);
    }

    static async handleLeftClick(req, res) {
        //const user = req.session.user;
        const matchId = req.params.matchId;
        const position = req.body.position;
        const gameRoom = MatchesPvEOffline.getGameRoomByMatchId(matchId);
        const cellsToSend = gameRoom.handleLeftClick(position);
        res.status(200).json(cellsToSend);
        gameRoom.hasGameFinished();
    }

    static async handleRightClick(req, res) {
        //const user = req.session.user;
        const matchId = req.params.matchId;
        const position = req.body.position;
        const gameRoom = MatchesPvEOffline.getGameRoomByMatchId(matchId);
        const cellsToSend = gameRoom.handleRightClick(position);
        return res.status(200).json(cellsToSend);
    }

    static async reset(req, res) {
        //const user = req.session.user;
        const matchId = req.params.matchId;
        const gameRoom = MatchesPvEOffline.getGameRoomByMatchId(matchId);
        gameRoom.handleReset();
        return res.status(200).end();
    }

    static async levelChange(req, res) {
        //const user = req.session.user;
        const matchId = req.params.matchId;
        const level = req.body.level;
        const gameRoom = MatchesPvEOffline.getGameRoomByMatchId(matchId);
        gameRoom.handleLevelChange(level);
        return res.status(200).end();
        
    }

    static async delete(req, res) {
        MatchesPvEOffline.deleteMatch(req.session.user.id);
        return res.status(200).end();
    }

}