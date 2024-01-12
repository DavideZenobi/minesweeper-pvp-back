import { GamePvPRoom } from "./GamePvPRoom.js";
import { Matches } from "./Matches.js";

export class GamePvPFactory {

    static createGameRoom(matchId, players) {
        const gameRoom = new GamePvPRoom(matchId, players);
        Matches.addMatch(matchId, players, gameRoom);
    }
}