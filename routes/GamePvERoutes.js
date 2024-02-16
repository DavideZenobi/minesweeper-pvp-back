import { Router } from "express";
import { GamePvEController } from "../controllers/GamePvEController.js";


export const gamePveRouter = Router();

gamePveRouter.get('/create', GamePvEController.create);
gamePveRouter.post('/leftClick', GamePvEController.handleLeftClick);
gamePveRouter.post('/rightClick', GamePvEController.handleRightClick);
gamePveRouter.get('/reset', GamePvEController.reset);
gamePveRouter.post('/levelChange', GamePvEController.levelChange);
gamePveRouter.get('/delete', GamePvEController.delete);