import { SessionModel } from "../models/SessionModel.js";


export const CheckDoubleLogin = async (req, res, next) => {
    const username = req.body.username;

    const sessions = await SessionModel.getAll();
    const parsedData = sessions.map(session => JSON.parse(session.data));
    const allUsernames = parsedData.map(data => data.user.username);

    if (allUsernames.includes(username)) {
        res.status(401).json({ message: 'User already logged in' });
    } else {
        next();
    }
}