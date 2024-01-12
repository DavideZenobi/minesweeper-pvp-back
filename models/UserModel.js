import db from "../db.js";

export class UserModel {

    static async create(userToInsert) {
        const [userHeaders, columns] = await db.execute('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [userToInsert.username, userToInsert.email, userToInsert.password]);
        if (userHeaders) {
            const [user, columns] = await db.execute('SELECT * FROM user WHERE id = ?', [userHeaders.insertId]);
            return user[0];
        } else {
            return false;
        }
    }

    static async getUserByUsername(username) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        return user[0];
    }

    static async getUserById(id) {
        const [user, columns] = await db.execute('SELECT * FROM user WHERE id = ?', [id]);
        return user[0];
    }

    static async delete() {

    }

    static async updateUserStatus(status, userId) {
        const [result, columns] = await db.execute('UPDATE user SET status = ? WHERE id = ?', [status, userId]);
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }

    static async getEmailByUserId(id) {
        const [email, columns] = await db.execute('SELECT email FROM user WHERE id = ?', [id]);
        return email[0].email;
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