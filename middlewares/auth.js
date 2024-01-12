import session from 'express-session';
import { SessionModel } from '../models/SessionModel.js';
import { UserModel } from '../models/UserModel.js';

export const AuthMiddleware = async (req, res, next) => {
    
    // Si no existe sessionId en la request, el usuario no esta autenticado
    if (!req.session.id) {
        res.status(401).json({ message: 'User not authenticated'});
    } 

    const dbSession = await SessionModel.getById(req.session.id);

    // Si existe la sesion en la base de datos, se controla los tiempos de expiracion.
    // Es posible que una sesion haya caducado pero el servidor no haya limpiado todavía las sesiones caducadas.
    if (dbSession) {
        const actualDateTime = new Date();
        const expirationDateTime = new Date(dbSession.expires * 1000);

        if (actualDateTime < expirationDateTime) {
            next();
        } else {
            res.status(401).json({ message: 'Session expired' });
        }

    } else {
        res.status(401).json({ message: 'User not authenticated'});
    }
}

export const checkVerification = async (req, res, next) => {
    const username = req.body.username;
    const user = await UserModel.getUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
    } else if (user.status) {
        
    }
}