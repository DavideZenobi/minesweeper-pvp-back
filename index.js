import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { lobbyRouter } from './routes/LobbyRoutes.js';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/lobby', lobbyRouter);

const port = process.env.port ?? 3000;

app.listen(port, () => {
    console.log(`Hello, I am at por ${port}`);
})