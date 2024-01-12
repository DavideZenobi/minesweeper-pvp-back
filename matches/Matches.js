

export class Matches {

    static gameRooms = new Array(); // {id, [players], gameRoom}

    static addUserIdGameRoom(userId, gameRoom) {
        this.gameRooms.set(userId, gameRoom);
    }

    static deleteUserIdGameRoom(userId) {
        this.gameRooms.delete(userId, gameRoom);
    }
}