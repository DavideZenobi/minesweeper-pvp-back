import { Router } from "express";
import { MatchController } from "../controllers/MatchController.js";
import { ValidateUserAndMatch } from '../middlewares/ValidateUserAndMatch.js';


export const matchRouter = Router();

matchRouter.get('/history', MatchController.getMatchesHistory);
matchRouter.get('/history/:matchId', MatchController.getGamesHistory);
matchRouter.get('/:matchId/validate', ValidateUserAndMatch, MatchController.validate);
matchRouter.get('/:matchId/config', ValidateUserAndMatch, MatchController.getMatchConfig);
matchRouter.get('/:matchId/ready', ValidateUserAndMatch, MatchController.userIsReady);
matchRouter.get('/:matchId/getStatus', ValidateUserAndMatch, MatchController.getUserStatus);
matchRouter.get('/:matchId/reconnect', ValidateUserAndMatch, MatchController.getInfoForReconnectedUser);