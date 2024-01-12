import { Router } from "express";
import { GameController } from "../controllers/GameController.js";


export const gameRouter = Router();

gameRouter.post('/:matchId/leftClick', GameController.handleLeftClick);
gameRouter.post('/:matchId/rightClick', GameController.handleRightClick);
gameRouter.post('/:matchId/levelChanged', GameController.handleLevelChange);
gameRouter.post('/:matchId/reset', GameController.handleReset);