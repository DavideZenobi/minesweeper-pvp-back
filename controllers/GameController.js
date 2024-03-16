import { Matches } from "../minesweeperpvp/Matches.js";


export class GameController {

    static handleLeftClick(req, res) {
        const user = req.session.user;
        const matchId = req.params.matchId;
        const position = req.body.position;
        const isValidated = Matches.validateUser(matchId, user.id);
        if (isValidated) {
            const gameRoom = Matches.getGameRoom(matchId);
            const data = gameRoom.handleLeftClick(user.id, position);
            if (data) {
                res.status(200).json(data);
                gameRoom.sendUpdatedCellsToOpponent(user.id);
                gameRoom.hasFinishedGame(user.id);
            } else {
                return res.status(403).json({ error: 'Game not started yet' });
            }
        } else {
            return res.status(403).json({ message: 'This is not your match' });
        }
    }

    static handleRightClick(req, res) {
        const user = req.session.user;
        const matchId = req.params.matchId;
        const position = req.body.position;
        const isValidated = Matches.validateUser(matchId, user.id);
        if (isValidated) {
            const gameRoom = Matches.getGameRoom(matchId);
            const data = gameRoom.handleRightClick(user.id, position);
            if (data) {
                res.status(200).json(data);
                gameRoom.sendUpdatedCellsToOpponent(user.id);
            } else {
                return res.status(403).json({ error: 'Game not started yet' });
            }
        } else {
            return res.status(403).json({ message: 'This is not your match' });
        }
    }
        
    static handleLevelChange(req, res) {

    }

    static handleReset(req, res) {

    }

}