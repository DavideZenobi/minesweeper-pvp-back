import { UserModel } from "../models/UserModel.js";
import { hashPassword } from "../utils/password.js";
import db from "../db.js";
import { createToken, isTokenValid } from "../services/TokenService.js";
import { TokenModel } from "../models/TokenModel.js";
import { sendRegisterMail } from "../mail/mail.js";


export class UserController {

    static async register(req, res) {

        // Crea el usuario y lo guarda en la BD
        const userToRegister = {
            email: req.body.email,
            username: req.body.username,
            password: await hashPassword(req.body.password),
        }
        const user = await UserModel.create(userToRegister);

        // Crea el token para confirmar usuario y lo guarda en la BD
        const token = createToken();
        const tokenToSave = {...token, userId: user.id};

        const responseToken = await TokenModel.create(tokenToSave);

        sendRegisterMail(req.body.email, responseToken.uuid);
        return res.status(200).json({ uuid: responseToken.uuid });
    }

    static async confirmUser(req, res) {
        const uuid = req.params.uuid;
        const userId = await TokenModel.getUserIdByUUID(uuid);
        const isValid = await isTokenValid(uuid);
        if (isValid) {
            await UserModel.updateUserStatus('accepted', userId);
            await TokenModel.delete(uuid);
            return res.status(200).end();
        } else {
            // El token no es válido. El tiempo de expiración ha pasado.
            await TokenModel.delete(uuid);
            const email = await UserModel.getEmailByUserId(userId);
            const token = createToken();
            const tokenToSave = {...token, userId: userId};
            const newToken = await TokenModel.create(tokenToSave);
            sendRegisterMail(email, newToken.uuid);
            return res.status(401).json({ message: 'Token has expired' });
        }
    }

    static async isEmailAvailable(req, res) {
        const email = req.params.email;
        const isAvailable = await UserModel.isEmailAvailable(email);
        return res.status(200).json({ isAvailable: isAvailable });
    }

    static async isUsernameAvailable(req, res) {
        const username = req.params.username;
        const isAvailable = await UserModel.isUsernameAvailable(username);
        return res.status(200).json({ isAvailable: isAvailable });
    }

}