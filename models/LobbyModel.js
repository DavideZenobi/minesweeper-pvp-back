import db from '../db.js';

export class LobbyModel {

    static async getAll() {
        const [lobbies, columns] = await db.execute('SELECT * FROM lobby');
        return lobbies;
    }

    static async getById(id) {
        const [lobby, columns] = await db.execute('SELECT * FROM lobby WHERE id = ?', [id]);
        return lobby;
    }

    static async create() {

    }

    static async delete() {

    }

    static async update() {

    }
}