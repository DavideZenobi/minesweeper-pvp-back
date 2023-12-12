import db from "../db.js";

export class UserModel {

    static async create(userToInsert) {
        const [user, columns] = await db.execute('INSERT INTO user (username, email, password, status) VALUES (?, ?, ?, ?)', [userToInsert.username, userToInsert.email, userToInsert.password, userToInsert.status]);
        if (user) {
            return user;
        } else {
            return false;
        }
    }

    static async getById() {

    }

    static async getUserByUsername(username) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        return user[0];
    }

    static async delete() {

    }

    static async getInfo(username) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        return user;
    }

    static async isEmailAvailable(email) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    static async isUsernameAvailable(username) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        if (user.length > 0) {
            return false;
        } else {
            return true;
        }
    }

}