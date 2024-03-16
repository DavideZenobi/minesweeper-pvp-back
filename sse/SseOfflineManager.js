

export class SseOfflineManager {

    static matchEmitter = new Map(); // key: matchId, value: response

    static addMatchEmitter(matchId, emitter) {
        this.matchEmitter.set(matchId, emitter);
    }

    static deleteMatchEmitter(matchId) {
        this.matchEmitter.delete(matchId);
    }

    static getEmitter(matchId) {
        return this.matchEmitter.get(matchId);
    }

    static sendEvent(matchId, event, data) {
        const emitter = this.getEmitter(matchId);
        if (emitter) {
            emitter.write(`event: ${event}\n`);
            emitter.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    }
}