import { Router } from "express";

export const publicClientRouter = Router();

publicClientRouter.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/login/login.html');
});