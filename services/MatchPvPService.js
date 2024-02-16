import dayjs from "dayjs";
import { GamePvPModel } from "../models/GamePvPModel.js";
import { MatchPvPModel } from "../models/MatchPvPModel.js";


export const saveMatchesAndGames = (matchesPvp) => {
    matchesPvp.forEach(async (matchPvp) => {

        const matchToSave = {
            uuid: matchPvp.id,
            totalGames: matchPvp.gameRoom.currentGameNumber,
            winnerUsername: matchPvp.gameRoom.winnerUsername,
            datetimeStarted: matchPvp.gameRoom.datetimeMatchStarted,
            datetimeFinished: matchPvp.gameRoom.datetimeMatchFinished,
            player1: matchPvp.players[0].id,
            player2: matchPvp.players[1].id,
        }

        const result = await MatchPvPModel.save(matchToSave);

        matchPvp.gameRoom.usersGames.forEach(userGame => {
            userGame.games.forEach((game) => {
                const gameToSave = {
                    matchPvpId: matchPvp.id,
                    userId: userGame.user.id,
                    gameNumber: game.gameNumber,
                    cells: JSON.stringify(game.cells),
                    level: game.level,
                    score: game.score,
                    time: game.totalTime,
                    datetimeStarted: dayjs(game.startTimestamp).format('YYYY-MM-DD HH:mm:ss'),
                    datetimeFinished: dayjs(game.finishTimestamp).format('YYYY-MM-DD HH:mm:ss'),
                }

                const result = GamePvPModel.save(gameToSave);
            });
        });
    });
}