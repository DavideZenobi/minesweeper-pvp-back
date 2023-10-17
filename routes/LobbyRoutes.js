import { Router } from 'express';
import { LobbyController } from '../controllers/LobbyController.js';

export const lobbyRouter = Router();

lobbyRouter.get('/', LobbyController.getAll);
lobbyRouter.get('/:id', LobbyController.getById);
lobbyRouter.post('/', LobbyController.create);
lobbyRouter.delete('/:id', LobbyController.delete);
lobbyRouter.patch('/:id', LobbyController.update);