import { Router } from "express";
import { RoomsHandler } from "../websocket/RoomsHandler.js";
import { RoomController } from "../controllers/RoomController.js";


export const roomsRouter = Router();

roomsRouter.get('/', RoomController.getAll);
roomsRouter.get('/info/:roomId', RoomController.getRoomInfo);