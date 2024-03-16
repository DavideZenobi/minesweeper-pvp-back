import { MatchesPvE } from "../minesweeper/MatchesPvE.js";


export class SseManager {

    static usersEmitters = new Map(); // key: userId, value: response

    static addUserEmitter(userId, emitter) {
        this.usersEmitters.set(userId, emitter);
    }

    static deleteUserEmitter(userId) {
        this.usersEmitters.delete(userId);
    }

    static getEmitter(userId) {
        return this.usersEmitters.get(userId);
    }

    static sendEvent(userId, event, data) {
        const emitter = this.getEmitter(userId);
        if (emitter) {
            emitter.write(`event: ${event}\n`);
            emitter.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    }

    static cleanBeforeDelete(userId) {
        MatchesPvE.deleteMatch(userId);
    }
}