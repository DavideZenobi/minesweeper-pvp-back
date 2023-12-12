import session from "express-session"
import { SessionModel } from "../models/SessionModel.js";

export class SessionController {

    static async validate(req, res) {
        const sessionId = req.sessionID;
        const dbSession = await SessionModel.getById(sessionId);

        if (dbSession) {
            const actualDateTime = new Date();
            const expirationDateTime = new Date(dbSession.expires * 1000);

            if (actualDateTime < expirationDateTime) {
                res.status(200).json({ isValid: true, sessionId: req.sessionID, user: req.session.user });
            }
            
        } else {
            res.status(200).json({ isValid: false, message: 'Session not valid' });
        }
    }

}