import http from 'node:http';
import express, { json } from 'express';
import session from 'express-session';

import { corsMiddleware } from './middlewares/cors.js';

import { publicApiRouter } from './routes/PublicApiRoutes.js';
import { protectedApiRouter } from './routes/ProtectedApiRoutes.js';
import { AuthMiddleware } from './middlewares/auth.js';
import { UserModel } from './models/UserModel.js';
import { sessionStore } from './db.js';
import { MatchmakingHandler } from './matchmaking/MatchmakingHandler.js';
import { Matches } from './minesweeperpvp/Matches.js';


// Server config
const app = express();
const server = http.createServer(app);
const port = process.env.PORT ?? 3000;


// Config
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by'); // Disable response header framework info (express in this case)
//app.use(express.static('client'));
app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000,
        //secure: true,
    },
    rolling: true,
    store: sessionStore
}));

MatchmakingHandler.init();
Matches.init();

// Public API routes
app.use('/api/public', publicApiRouter);

// Protected API routes
app.use('/api/private', AuthMiddleware, protectedApiRouter);

// TEST ROUTE //
app.use('/user/:username', AuthMiddleware, async (req, res) => {
    res.json(await UserModel.getUserByUsername(req.params.username));
});

// Custom 404
app.use((req, res, next) => {
    res.status(404).send('Sorry can not find that!');
});

// Custom error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong with server');
});

server.listen(port, () => {
    console.log(`Hello, I am at port ${port}`);
});