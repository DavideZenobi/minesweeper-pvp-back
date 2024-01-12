

export class Matches {

    static matches = new Array(); // [{id, [players], gameRoom}]

    static addMatch(matchId, players, gameRoom) {
        this.matches.push({
            id: matchId, 
            players: players, 
            gameRoom: gameRoom,
        });
    }

    static deleteMatch(matchId) {
        this.matches = this.matches.filter(match => match.id !== matchId);
    }

    static getGameRoom(matchId) {
        return this.matches.find(match => match.id === matchId).gameRoom;
    }

    static validateMatch(matchId) {
        let isValidated = false;
        const match = this.matches.find(match => match.id === matchId);
        if (!match) {
            return isValidated;
        }

        const gameStatus = match.gameRoom.status;
        if (gameStatus !== 'finished') {
            isValidated = true;
        }
        
        return isValidated;
    }

    static validateUser(matchId, userId) {
        let isValidated = false;
        const match = this.matches.find(match => match.id === matchId);
        if (!match) {
            return isValidated;
        }

        for (const player of match.players) {
            if (player.id === userId) {
                isValidated = true;
                break;
            }
        }

        return isValidated;
    }
}