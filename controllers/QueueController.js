import { Queue } from "../matchmaking/Queue.js";

export class QueueController {

    static join(req, res) {
        let user = req.session.user;
        user = {...user, status: 'available'};
        const result = Queue.join(user);

        if (result) {
            console.log('Joined Succesfully');
            res.status(200).json({ message: 'Joined queue successfully', queueLength: Queue.playersInQueue.length });
        } else {
            res.status(500).json({ message: 'Error with server' });
        }
    }

    static leave(req, res) {
        const playerId = req.session.user.id;
        const removedUser = Queue.remove(playerId);
        
        if (removedUser) {
            console.log('User: ' + removedUser.username + ' left queue successfully');
            res.status(200).json({ message: 'User left queue'});
        } else {
            res.status(200).json({ message: 'There was no user in queue' });
        }
    }  

    static rejoin(req, res) {
        const playerId = req.session.user.id;
        Queue.backToQueue(playerId);
        res.status(200).json({ message: 'Back to queue' });
    }

    static currentPlayers(req, res) {
        res.status(200).json({ playersInQueue: Queue.playersInQueue.length, players: Queue.playersInQueue });
    }

}