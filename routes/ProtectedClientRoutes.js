import { Router } from "express";

export const protectedClientRouter = Router();

protectedClientRouter.get('/lobbies', (req, res) => {
    if (req.session.user) {
        res.sendFile(process.cwd() + '/client/lobbies/lobbies.html');
    } else {
        console.log('User not authenticated');
        res.status(401).json({ message: 'User not authenticated' });
    }
});

protectedClientRouter.get('/profile', (req, res) => {
    if (req.session.user) {
        res.sendFile(process.cwd() + '/client/profile/profile.html');
    } else {
        console.log('User not authenticated');
        res.status(401).json({ message: 'User not authenticated' });
    }
});