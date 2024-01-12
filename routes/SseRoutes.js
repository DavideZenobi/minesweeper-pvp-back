import { Router } from "express";
import { sseHeaders } from "../middlewares/sseHeaders.js";
import { SseController } from "../controllers/SseController.js";


export const sseRouter = Router();

sseRouter.get('/', sseHeaders, SseController.subscribe);