import db from "../db.js";


export class TokenModel {

    static async getByUUID(uuid) {
        const [token, columns] = await db.execute('SELECT * FROM token WHERE uuid = ?', [uuid]);
        return token[0];
    }

    static async create(data) { // {uuid, userId, expirationTime}
        const [response, columns] = await db.execute('INSERT INTO token (uuid, user_id, expiration_datetime) VALUES (?, ?, ?)', [data.uuid, data.userId, data.expirationTime]);
        const token = this.getByUUID(data.uuid);
        return token;
    }

    static async delete(uuid) {
        const [response, columns] = await db.execute('DELETE FROM token WHERE uuid = ?', [uuid]);
        return response;
    }
    
    static async getUserIdByUUID(uuid) {
        const [token, columns] = await db.execute('SELECT user_id FROM token WHERE uuid = ?', [uuid]);
        return token[0].user_id;
    }
}