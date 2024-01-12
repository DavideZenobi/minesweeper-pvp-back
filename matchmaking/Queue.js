import { SseManager } from "../sse/SseManager.js";


export class Queue {

    static playersInQueue = []; // {userId, username, status}

    static join(user) {
        user = {...user, status: 'available'};
        this.playersInQueue.push(user);
        const checkPushedUser = this.playersInQueue.some(player => player.id === user.id);
        if (checkPushedUser) {
            return true;
        } else {
            return false;
        }
    }

    static backToQueue(userId) {
        const playerIndex = this.playersInQueue.findIndex(player => player.id === userId);
        this.playersInQueue[playerIndex].status = 'available';
    }

    static remove(userId) {
        const removedUser = this.playersInQueue.find(player => player.id === userId);
        if (removedUser) {
            this.playersInQueue = this.playersInQueue.filter(player => player.id !== userId);
            SseManager.sendEvent(userId, 'user-left-queue', { message: 'OK' });''
            return removedUser;
        } else {
            return null;
        }
        
    }

    static findMatch() {
        const checkEnoughPlayers = this.playersInQueue.filter(player => player.status === 'available');
        
        if (checkEnoughPlayers.length >= 2) {
            const availablePlayers = [];

            for (const player of this.playersInQueue) {
                if (player.status === 'available') {
                    availablePlayers.push(player);
                    player.status = 'pending';
                }

                if (availablePlayers.length >= 2) {
                    break;
                }
            }

            return availablePlayers;
        }  
    }

    static getAvailablePlayersLength() {
        let counter = 0;
        this.playersInQueue.forEach(player => {
            if (player.status === 'available') {
                counter++;
            }
        });

        return counter;
    }
    
}