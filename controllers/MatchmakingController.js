import { MatchmakingHandler } from "../matchmaking/MatchmakingHandler.js";


export class MatchmakingController {

    static handleMatchmakingAction(req, res) {
        const user = req.session.user;
        const matchId = req.body.matchId;
        const action = req.params.action;
        if (action === 'accept' || action === 'decline') {
            MatchmakingHandler.processAction(action, matchId, user);
            res.status(200).end();
        } else {
            res.status(404).json({ message: 'Invalid action' });
        }
        
    }
}