import { Router } from "express";
import { UserAuthController } from "../controllers/UserAuthController.js";
import { SessionController } from "../controllers/SessionController.js";
import { CheckDoubleLogin } from "../middlewares/CheckDoubleLogin.js";
import { UserController } from "../controllers/UserController.js";
import { verifyUserExistence, verifyUsernameAndEmailAvailability } from "../middlewares/authv2.js";

export const publicApiRouter = Router();

publicApiRouter.post('/login', verifyUserExistence, CheckDoubleLogin, UserAuthController.login);
publicApiRouter.post('/register', verifyUsernameAndEmailAvailability, UserController.register);
publicApiRouter.post('/confirm/:uuid', UserController.confirmUser);
publicApiRouter.get('/email/available/:email', UserController.isEmailAvailable);
publicApiRouter.get('/username/available/:username', UserController.isUsernameAvailable);
publicApiRouter.get('/session/auth', SessionController.validate);