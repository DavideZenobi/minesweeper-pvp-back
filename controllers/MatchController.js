import dayjs from "dayjs";
import { Matches } from "../minesweeperpvp/Matches.js";
import { MatchPvPModel } from "../models/MatchPvPModel.js";
import { UserModel } from "../models/UserModel.js";
import { GamePvPModel } from "../models/GamePvPModel.js";


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

    static async getMatchesHistory(req, res) {
        const user = req.session.user;
        const matches = await MatchPvPModel.getAllByUserId(user.id);
        const dataToSend = new Array();

        for (const match of matches) {
            const opponentId = match.player_1 === user.id ? match.player_2 : match.player_1;
            const opponentUsername = await UserModel.getUsernameById(opponentId);
            const data = {
                id: match.uuid,
                opponentUsername: opponentUsername,
                winner: match.winner_username,
                totalGames: match.total_games,
                datetimeStarted: dayjs(match.datetime_started).format('YYYY-MM-DD HH:mm:ss'),
            }
            dataToSend.push(data);
        }
        return res.status(200).json(dataToSend);
    }

    static async getGamesHistory(req, res) {
        const user = req.session.user;
        const matchId = req.params.matchId;

        // Se recuperan los games de los 2 jugadores
        const games = await GamePvPModel.getByMatchId(matchId);
        if (games.length === 0) {
            return res.status(404).end();
        }

        const gamesByUser = new Array();
        let ids = new Array();

        for (const game of games) {
            if (!ids.includes(game.user_id)) {
                ids.push(game.user_id);
                const username = await UserModel.getUsernameById(game.user_id);
                gamesByUser.push({id: game.user_id, username: username, games: new Array()});
            }

            for (const gameByUser of gamesByUser) {
                if (gameByUser.id === game.user_id) {
                    delete game.user_id;
                    gameByUser.games.push(game);
                    break;
                }
            }
        }

        gamesByUser.forEach(gameByUser => delete gameByUser.id);

        //gamesByUser[user.username].sort((a, b) => a.game_number - b.game_number);
        //gamesByUser[opponentUsername].sort((a, b) => a.game_number - b.game_number);
        return res.status(200).json(gamesByUser);
    }

}