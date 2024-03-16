import { SseOfflineManager } from "../sse/SseOfflineManager.js";


export class SseOfflineController {

    static subscribe(req, res) {
        const matchId = req.params.matchId;
        const event = 'event: status\n';
        const message = 'data: Connected\n\n';
        res.write(event);
        res.write(message);

        SseOfflineManager.addMatchEmitter(matchId, res);

        req.on('close', () => {
            SseOfflineManager.deleteMatchEmitter(matchId);
            res.end();
        });
    }
}