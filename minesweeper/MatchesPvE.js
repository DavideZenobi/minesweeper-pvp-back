export class MatchesPvE {

    static matches = new Array(); //[{player: {username, id}, gameRoom}]

    static addMatch(player, gameRoom) {
        this.matches.push({
            player: player,
            gameRoom: gameRoom
        });
    }

    static deleteMatch(userId) {
        const match = this.matches.find(match => match.player.id === userId);
        if (match) {
            match.gameRoom.stopTimer();
            match.gameRoom.gamePve.stopTimer();
            this.matches = this.matches.filter(match => match.player.id !== userId);
        }
    }

    static getGameRoomByUserId(userId) {
        return this.matches.find(match => match.player.id === userId).gameRoom;
    }
}