import { sendRegisterMail } from "../mail/mail.js";
import { UserModel } from "../models/UserModel.js";
import { checkPassword } from "../utils/password.js";

export class UserAuthController {

    static usersLoggedIn = new Array();

    static async login(req, res) {
        const usernameInput = req.body.username;
        const passwordInput = req.body.password;
        const user = res.locals.user;

        try {
            await checkPassword(passwordInput, user.password);
            const userSession = { id: user.id, username: user.username };
            req.session.user = userSession;
            //sendRegisterMail();
            return res.status(200).json({ sessionId: req.sessionID, user: req.session.user });
        } catch (err) {
            console.log()
            return res.status(401).json({ message: 'Incorrect password' });
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
        /*const username = req.session.user.username;
        const userInfo = await UserModel.getInfo(username);
        return res.status(200).json(userInfo);*/
    }

    static async test(req, res) {
        return res.status(200);
    }

}