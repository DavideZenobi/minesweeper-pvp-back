import { Matches } from "../minesweeperpvp/Matches.js";


export class MatchController {

    static validate(req, res) {
        return res.status(200).json({ message: 'OK' });
    }

    static getMatchConfig(req, res) {
        const matchId = req.params.matchId;
        const gameRoom = Matches.getGameRoom(matchId);
        const data = gameRoom.getMatchConfig();
        return res.status(200).json(data);
    }

    static userIsReady(req, res) {
        const userId = req.session.user.id;
        const matchId = req.params.matchId;
        const gameRoom = Matches.getGameRoom(matchId);
        gameRoom.userConnects(userId);
        res.status(200).end();
        gameRoom.isEveryoneReadyToStart();
    }

    static getUserStatus(req, res) {
        const userId = req.session.user.id;
        const matchId = req.params.matchId;
        const gameRoom = Matches.getGameRoom(matchId);
        const status = gameRoom.getUserStatus(userId);
        return res.status(200).json({ status: status });
    }

    static getInfoForReconnectedUser(req, res) {
        const userId = req.session.user.id;
        const matchId = req.params.matchId;
        const gameRoom = Matches.getGameRoom(matchId);
        const data = gameRoom.getInfoForReconnectedUser(userId);
        return res.status(200).json({ data: data });
    }

}