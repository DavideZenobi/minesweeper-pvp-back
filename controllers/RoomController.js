import { RoomsHandler } from "../websocket/RoomsHandler.js";


export class RoomController {

    static getAll(req, res) {
        const rooms = RoomsHandler.getAllRooms();
        res.status(200).json(rooms);
    }

    static getRoomInfo(req, res) {
        const roomId = req.params.roomId;
        const roomInfo = RoomsHandler.getRoomInfo(roomId);
        res.status(200).json(roomInfo);
    }

}