

export class MatchesPvEOffline {

    // [{matchId, response, gameRoom}]
    static matches = new Array();

    static addMatch(matchId, gameRoom) {
        this.matches.push({
            matchId: matchId,
            gameRoom: gameRoom,
        });
    }

    static deleteMatch(matchId) {
        const match = this.matches.find(match => match.matchId === matchId);
        if (match) {
            match.gameRoom.stopTimer();
            match.gameRoom.gamePve.stopTimer();
            this.matches = this.matches.filter(match => match.matchId !== matchId);
        }
    }

    static getGameRoomByMatchId(matchId) {
        return this.matches.find(match => match.matchId === matchId).gameRoom;
    }
}