

export class RoomsHandler {
    
    static rooms = [];

    static addRoom(room) {
        this.rooms.push(room);
    }

    static deleteRoom(roomId) {
        this.rooms = this.rooms.filter(room => room.roomId !== roomId);
    }

    static getAllRooms() {
        // Necesito no incluir la propiedad io porque daba error: TypeError: Converting circular structure to JSON
        return this.rooms.map(room => ({
            roomId: room.roomId,
            roomStatus: room.roomStatus,
        }));
    }

    static getRoomInfo(roomId) {
        const room = this.rooms.find(room => room.roomId === roomId);
        const roomInfo = room.getInfo();
        return roomInfo;
    }

    static cleanRooms() {
        this.rooms = this.rooms.filter(room => room.roomStatus !== 'toDestroy');
    }

    static processRooms() {
        this.cleanRooms();
    }

    id = setInterval(this.processRooms, 10 * 1000);
}