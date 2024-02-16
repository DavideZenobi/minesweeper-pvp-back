import db from "../db.js";


export class MatchPvPModel {

    static async save(matchPvp) {
        const [match, columns] = await db.execute(
            'INSERT INTO match_pvp (uuid, total_games, winner_username, datetime_started, datetime_finished, player_1, player_2) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [matchPvp.uuid, matchPvp.totalGames, matchPvp.winnerUsername, matchPvp.datetimeStarted, matchPvp.datetimeFinished, matchPvp.player1, matchPvp.player2]
        );

        if (match.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }

    static async getAllByUserId(userId) {
        const [matches, columns] = await db.execute('SELECT * FROM match_pvp WHERE player_1 = ? OR player_2 = ? ORDER BY datetime_started DESC', [userId, userId]);

        return matches;
    }

}