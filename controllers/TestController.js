import { GamePvPModel } from "../models/GamePvPModel.js";
import { MatchPvPModel } from "../models/MatchPvPModel.js";


export class TestController {

    static async saveMatch(req, res) {
        const match = {
            uuid: req.body.uuid,
            players: req.body.players,
            totalGames: req.body.totalGames,
            winnerUsername: req.body.winnerUsername,
            datetimeStarted: req.body.datetimeStarted,
            datetimeFinished: req.body.datetimeFinished
        }

        const matchResult = await MatchPvPModel.save(match);

        return res.status(200).end();
    }

    static async saveGame(req, res) {
        const game = {
            matchPvpId: req.body.matchPvpId,
            userId: req.body.userId,
            gameNumber: req.body.gameNumber,
            cells: req.body.cells,
            level: req.body.level,
            score: req.body.score,
            time: req.body.time,
            datetimeStarted: req.body.datetimeStarted,
            datetimeFinished: req.body.datetimeFinished
        }

        const gameResult = await GamePvPModel.save(game);

        return res.status(200).end();
    }

}