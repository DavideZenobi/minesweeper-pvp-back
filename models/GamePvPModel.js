import db from "../db.js";


export class GamePvPModel {

    static async save(gamePvp) {
        const [game, columns] = await db.execute(
            'INSERT INTO game_pvp (match_pvp_id, user_id, game_number, cells, level, score, time, datetime_started, datetime_finished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [gamePvp.matchPvpId, gamePvp.userId, gamePvp.gameNumber, gamePvp.cells, gamePvp.level, gamePvp.score, gamePvp.time, gamePvp.datetimeStarted, gamePvp.datetimeFinished]
        );

        if (game.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }

    static async getByMatchId(matchId) {
        const [games, columns] = await db.execute('SELECT * FROM game_pvp WHERE match_pvp_id = ?', [matchId]);
        return games;
    }

}