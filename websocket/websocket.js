import { Server } from 'socket.io';
import { ACCEPTED_ORIGINS } from '../middlewares/cors.js';
import { Queue } from '../matchmaking/Queue.js';
import { SessionModel } from '../models/SessionModel.js';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room.js';
import { RoomsHandler } from './RoomsHandler.js';

// key: userId | Value: WebSocketIndividual
const usersAndSockets = new Map();

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

    io.on('connection', async (socket) => {
        const user = await SessionModel.getUserBySessionId(socket.handshake.auth.token);
        if (!user) {
            return socket.disconnect();
        }

        usersAndSockets.set(user.id, socket);


        socket.on('disconnect', () => {
            usersAndSockets.delete(user.id);
            socket.removeAllListeners();
            //Queue.remove(user.id);
        });
    });

    // Send how many current players are in queue every 5 seconds
    const updatePlayersInQueue = () => {
        io.emit('update-players-queue', { playersInQueue: Queue.playersInQueue.length });
    }
    const updatePlayersInQueueIntervalId = setInterval(updatePlayersInQueue, 5 * 1000);

    // Find match
    const tryToMatch = () => {
        console.log(Queue.getAvailablePlayersLength());
        const players = Queue.findMatch();
        if (players) {
            const uuid = uuidv4();
            const playersAndSockets = new Array();
            
            players.forEach(player => {
                const socketByPlayer = usersAndSockets.get(player.id);
                playersAndSockets.push({userId: player.id, username: player.username, socket: socketByPlayer});
            });

            const newRoom = new Room(io, uuid, playersAndSockets);
            newRoom.initializeListeners();
            RoomsHandler.addRoom(newRoom);
        }
    }
    const tryToMatchIntervalId = setInterval(tryToMatch, 5 * 1000);

}


