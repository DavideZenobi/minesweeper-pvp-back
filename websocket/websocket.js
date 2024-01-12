import { Server } from 'socket.io';
import { ACCEPTED_ORIGINS } from '../middlewares/cors.js';
import { WebSocketsHandler } from './WebSocketsHandler.js';
import { SessionModel } from '../models/SessionModel.js';

// Initialize websocket server and config
export const initializeWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ACCEPTED_ORIGINS,
            credentials: true
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 10000
        },
    });

    WebSocketsHandler.init(io);

    io.use(async (socket, next) => {
        const user = await SessionModel.getUserBySessionId(socket.handshake.auth.token);
        const customSocket = WebSocketsHandler.getSocketByUserId(user.id);
        if (customSocket) {
            const error = new Error('Not allowed multiple tabs');
            next(error);
        } else {
            next();
        }
    });

    io.on('connection', async (socket) => {
        console.log('user connected');
        const user = await SessionModel.getUserBySessionId(socket.handshake.auth.token);

        socket.use((packet, next) => {
            packet.splice(1, 0, user);
            next();
        });

        socket.on('test', (user, ...data) => {
            console.log(data);
        });

        WebSocketsHandler.addSocket(socket);

        socket.on('disconnect', () => {
            console.log('disconnected');
            WebSocketsHandler.deleteSocket(socket);
        });
    });


    return io;
}


