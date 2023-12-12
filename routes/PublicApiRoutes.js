import { Router } from "express";
import { UserAuthController } from "../controllers/UserAuthController.js";
import { SessionController } from "../controllers/SessionController.js";
import { CheckDoubleLogin } from "../middlewares/CheckDoubleLogin.js";
import { UserController } from "../controllers/UserController.js";

export const publicApiRouter = Router();

publicApiRouter.post('/login', CheckDoubleLogin, UserAuthController.login);
publicApiRouter.post('/register', UserController.register);
publicApiRouter.get('/email/available/:email', UserController.isEmailAvailable);
publicApiRouter.get('/username/available/:username', UserController.isUsernameAvailable);
publicApiRouter.get('/session/auth', SessionController.validate);