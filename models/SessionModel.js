import db from "../db.js";

export class SessionModel {

    static async getById(sessionId) {
        const [session, columns] = await db.execute('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
        return session[0];
    }

    static async getUserBySessionId(sessionId) {
        const [jsonData, columns] = await db.execute('SELECT data FROM sessions WHERE session_id = ?', [sessionId]);
        if (jsonData.length === 0) {
            return null;
        }
        const jsData = JSON.parse(jsonData[0].data);
        const user = jsData.user;
        return user;
    }

    static async getAll() {
        const [sessions, columns] = await db.execute('SELECT * FROM sessions');
        if (sessions) {
            return sessions;
        } else {
            return null;
        }
    }
}