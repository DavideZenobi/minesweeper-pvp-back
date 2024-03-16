import { GamePvEOfflineRoom } from "./GamePvEOfflineRoom.js";
import { v4 as uuidv4 } from 'uuid';
import { MatchesPvEOffline } from "./MatchesPvEOffline.js";

export const createGamePvEOffline = () => {
    const matchId = uuidv4();
    const gameRoom = new GamePvEOfflineRoom(matchId);
    MatchesPvEOffline.addMatch(matchId, gameRoom)
    return matchId;
}