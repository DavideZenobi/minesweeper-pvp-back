import { Router } from "express";
import { GamePvEOfflineController } from "../controllers/GamePvEOfflineController.js";


export const gamePveOfflineRouter = Router();

gamePveOfflineRouter.get('/create', GamePvEOfflineController.create);
gamePveOfflineRouter.post('/leftClick/:matchId', GamePvEOfflineController.handleLeftClick);
gamePveOfflineRouter.post('/rightClick/:matchId', GamePvEOfflineController.handleRightClick);
gamePveOfflineRouter.get('/reset/:matchId', GamePvEOfflineController.reset);
gamePveOfflineRouter.post('/levelChange/:matchId', GamePvEOfflineController.levelChange);
gamePveOfflineRouter.get('/delete/:matchId', GamePvEOfflineController.delete);