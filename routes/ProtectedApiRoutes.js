import { Router } from "express";
import { UserAuthController } from "../controllers/UserAuthController.js";
import { lobbyRouter } from "./LobbyRoutes.js";
import { queueRouter } from "./QueueRoutes.js";
import { roomsRouter } from "./RoomsRoutes.js";

export const protectedApiRouter = Router();

protectedApiRouter.post('/logout', UserAuthController.logout);
protectedApiRouter.get('/profile', UserAuthController.getProfileInfo);
protectedApiRouter.use('/lobbies', lobbyRouter);
protectedApiRouter.use('/queue', queueRouter);
protectedApiRouter.use('/room', roomsRouter);