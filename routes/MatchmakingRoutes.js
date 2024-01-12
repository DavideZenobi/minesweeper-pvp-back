import { Router } from "express";
import { MatchmakingController } from "../controllers/MatchmakingController.js";


export const matchmakingRouter = Router();

matchmakingRouter.post('/:action', MatchmakingController.handleMatchmakingAction);