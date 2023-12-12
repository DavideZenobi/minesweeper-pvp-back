import http from 'node:http';
import express, { json } from 'express';
import session from 'express-session';

import { initializeWebSocket } from './websocket/websocket.js';
//import { Server } from 'socket.io';

import { corsMiddleware } from './middlewares/cors.js';

import { publicApiRouter } from './routes/PublicApiRoutes.js';
import { protectedApiRouter } from './routes/ProtectedApiRoutes.js';
import { AuthMiddleware } from './middlewares/auth.js';
import { UserModel } from './models/UserModel.js';
import { sessionStore } from './db.js';


// Server config
const app = express();
const server = http.createServer(app);
initializeWebSocket(server);
const port = process.env.PORT ?? 3000;


// Config
app.use(json());
app.use(corsMiddleware());
//app.use(express.static('client'));
app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
        //secure: true,
    },
    rolling: true,
    store: sessionStore
}));

app.disable('x-powered-by'); // Disable response header framework info (express in this case)

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