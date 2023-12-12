import { UserModel } from "../models/UserModel.js";
import { checkPassword } from "../utils/password.js";

export class UserAuthController {

    static usersLoggedIn = new Array();

    static async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const user = await UserModel.getUserByUsername(username);
        
        if (!user) {
            return res.status(401).json('User does not exist');
        } else if (user.status != 'accepted') {
            return res.status(401).json({ message: 'User needs to verify email' });
        }

        try {
            await checkPassword(password, user.password);
            const userSessionData = { id: user.id, username: user.username };
            req.session.user = userSessionData;
            console.log('Valid password. User authenticated');
            return res.status(200).json({ sessionId: req.sessionID, user: req.session.user });

        } catch (err) {
            console.log('Invalid password. Failed authentication');
            return res.status(401).json('Password not matching');
        }

    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al cerrar sesión');
            } else {
                
                res.clearCookie('connect.sid');
                console.log('Session closed succesfully');
                return res.status(200).json('Cierre de sesión con éxito');
            }
        });
    }

    static async getProfileInfo(req, res) {
        const username = req.session.user.username;
        const userInfo = await UserModel.getInfo(username);
        return res.status(200).json(userInfo);
    }

    static async test(req, res) {
        return res.status(200);
    }

}