import { Router } from "express";
import { QueueController } from "../controllers/QueueController.js";


export const queueRouter = Router();

queueRouter.post('/join', QueueController.join);
queueRouter.post('/leave', QueueController.leave);
queueRouter.post('/rejoin', QueueController.rejoin);
queueRouter.get('/current-players', QueueController.currentPlayers); // Test route