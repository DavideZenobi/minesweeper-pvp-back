import { UserModel } from "../models/UserModel.js";
import { hashPassword } from "../utils/password.js";


export class UserController {

    static async register(req, res) {
        const userToRegister = {
            email: req.body.email,
            username: req.body.username,
            password: await hashPassword(req.body.password),
            status: 'accepted',
        }

        const result = await UserModel.create(userToRegister);

        if (result) {
            return res.status(200).json({ message: 'hello' });
        } else {
            return res.status(500).json({ message: 'Couldn\'t create user' });
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