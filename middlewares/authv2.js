import { UserModel } from "../models/UserModel.js"


/**
 * Middleware solamente usado en el log in
 * Controla si el usuario existe.
 * En caso de que exista, controla el status.
 * Si todo es correcto, llama a next().
 */
export const verifyUserExistence = async (req, res, next) => {
    const user = await UserModel.getUserByUsername(req.body.username);
    
    if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
    }

    if (user.status === 'pending') {
        return res.status(401).json({ message: 'User needs to verify email' });
    } else if (user.status === 'banned') {
        return res.status(401).json({ message: 'User is banned' });
    } else if (user.status === 'accepted') {
        res.locals.user = user;
        next();
    }
}

// 
export const verifyCookie = (req, res, next) => {

}

export const verifyUsernameAndEmailAvailability = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const isUsernameAvailable = await UserModel.isUsernameAvailable(username);
    if (!isUsernameAvailable) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const isEmailAvailable = await UserModel.isEmailAvailable(email);
    if (!isEmailAvailable) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    next();
}