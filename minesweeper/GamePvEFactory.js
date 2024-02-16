import { MatchesPvE } from "./MatchesPvE.js";
import { GamePvERoom } from "./GamePvERoom.js";


export const createGamePvE = (player) => {
    const gameRoom = new GamePvERoom(player);
    MatchesPvE.addMatch(player, gameRoom);
}