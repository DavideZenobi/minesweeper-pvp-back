import { Router } from "express";
import { UserAuthController } from "../controllers/UserAuthController.js";
import { queueRouter } from "./QueueRoutes.js";
import { roomsRouter } from "./RoomsRoutes.js";
import { sseRouter } from "./SseRoutes.js";
import { gameRouter } from "./GameRoutes.js";
import { matchmakingRouter } from "./MatchmakingRoutes.js";
import { matchRouter } from "./MatchRoutes.js";
import { gamePveRouter } from "./GamePvERoutes.js";

export const protectedApiRouter = Router();

protectedApiRouter.post('/logout', UserAuthController.logout);
protectedApiRouter.get('/profile', UserAuthController.getProfileInfo);
protectedApiRouter.use('/sse', sseRouter);
protectedApiRouter.use('/match', matchRouter);
protectedApiRouter.use('/matchmaking', matchmakingRouter);
protectedApiRouter.use('/game', gameRouter);
protectedApiRouter.use('/gamepve', gamePveRouter);
protectedApiRouter.use('/queue', queueRouter);
protectedApiRouter.use('/room', roomsRouter);