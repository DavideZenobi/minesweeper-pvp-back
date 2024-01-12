import { GamePvESoloController } from "../websocket/GamePvESoloController.js";

export class GamesPvESoloManager {

    static socketsControllers = new Map();

    static createGame(type, socket) {
        const controller = new GamePvESoloController(socket);
        this.socketsControllers.set(socket, controller);
    }

    static deleteGame(socket) {
        
    }
}