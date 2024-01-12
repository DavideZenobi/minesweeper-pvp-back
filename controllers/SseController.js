import { SseManager } from "../sse/SseManager.js";

export class SseController {

    static subscribe(req, res) {
        const userId = req.session.user.id;
        const event = 'event: status\n';
        const message = 'data: Connected\n\n';
        res.write(event);
        res.write(message);

        SseManager.addUserEmitter(userId, res);

        req.on('close', () => {
            SseManager.cleanBeforeDelete(userId);
            SseManager.deleteUserEmitter(userId);
            res.end();
        });
    }
}