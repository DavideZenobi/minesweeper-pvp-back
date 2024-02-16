import { Router } from "express";
import { UserAuthController } from "../controllers/UserAuthController.js";
import { SessionController } from "../controllers/SessionController.js";
import { CheckDoubleLogin } from "../middlewares/CheckDoubleLogin.js";
import { UserController } from "../controllers/UserController.js";
import { tokenExists, verifyUserExistence, verifyUsernameAndEmailAvailability } from "../middlewares/authv2.js";
import { TestController } from "../controllers/TestController.js";

export const publicApiRouter = Router();

publicApiRouter.post('/login', verifyUserExistence, CheckDoubleLogin, UserAuthController.login);
publicApiRouter.post('/register', verifyUsernameAndEmailAvailability, UserController.register);
publicApiRouter.get('/confirm/:uuid', tokenExists, UserController.confirmUser);
publicApiRouter.get('/email/available/:email', UserController.isEmailAvailable);
publicApiRouter.get('/username/available/:username', UserController.isUsernameAvailable);
publicApiRouter.get('/session/auth', SessionController.validate);
publicApiRouter.post('/match/save', TestController.saveMatch);
publicApiRouter.post('/game/save', TestController.saveGame);