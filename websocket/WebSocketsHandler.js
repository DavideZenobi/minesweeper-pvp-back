import { SessionModel } from "../models/SessionModel.js";

export class WebSocketsHandler {
    static userIdsSockets = new Map(); // key = userId | value = socket
    static io;

    static init(io) {
        this.io = io;
    }

    static async addSocket(socket) {
        const user = await SessionModel.getUserBySessionId(socket.handshake.auth.token);
        if (!user) {
            return socket.disconnect();
        }

        this.userIdsSockets.set(user.id, socket);
    }

    static async deleteSocket(socket) {
        const user = await SessionModel.getUserBySessionId(socket.handshake.auth.token);
        if (!user) {
            return socket.disconnect();
        }

        this.userIdsSockets.delete(user.id);
    }

    static getSocketByUserId(userId) {
        return this.userIdsSockets.get(userId);
    }

    static sendEventToUser(userId, event, message) {
        const socket = this.userIdsSockets.get(userId);
        socket.emit(event, message);
    }

    static sendEventToUsers(userIds, event, message) {
        this.io.to().emit(event, message);
    }

    static sendBroadcastEvent() {

    }
}