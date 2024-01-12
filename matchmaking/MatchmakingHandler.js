import { Queue } from "./Queue.js";
import { SseManager } from "../sse/SseManager.js";
import { v4 as uuidv4 } from 'uuid';
import { GamePvPFactory } from "../minesweeperpvp/GamePvPFactory.js";

export class MatchmakingHandler {
    static queueIntervalId;
    static preparingMatches = new Array(); // [{matchId, [{id, username, status}], countdown, countdownIntervalId}]

    static init() {
        this.queueIntervalId = setInterval(this.findMatch, 5 * 1000);
    }

    static getUsersByMatchId(matchId) {
        return this.preparingMatches.find(match => match.id === matchId).players;
    }

    static findMatch = () => {
        const players = Queue.findMatch();
        if (players) {
            const matchId = uuidv4();
            const playersToSet = [];
            const playersToSend = [];

            players.forEach(player => {
                playersToSet.push({id: player.id, username: player.username, status: 'pending'}); // Array para settear en esta clase
                playersToSend.push({username: player.username, status: 'pending'}); // Es diferente a la otra array para no enviar los ids de los usuarios.
            });

            players.forEach(player => {
                SseManager.sendEvent(player.id, 'match-found', {matchId: matchId, players: playersToSend});
            });


            this.preparingMatches.push({
                id: matchId,
                players: playersToSet,
                countdown: 20,
                intervalId: '',
            });
            const match = this.preparingMatches.find(match => match.id === matchId);
            this.startCountdown(match);
        }
    }

    static processAction(action, matchId, user) {
        const match = this.preparingMatches.find(match => match.id === matchId);

        if (action === 'accept') {
            this.acceptMatch(match, user);
            match.players.forEach(player => {
                if (player.id !== user.id) {
                    SseManager.sendEvent(player.id, 'user-update', {username: user.username, status: 'accepted'});
                }
            });

            const response = this.haveAllUsersAccepted(match);

            if (response) { // Si todos han aceptado el match
                match.players.forEach(player => {
                    SseManager.sendEvent(player.id, 'match-accepted', {match: 'OK'});
                    Queue.remove(player.id);
                });

                const playersToAdd = new Array();
                match.players.forEach(player => {
                    playersToAdd.push({
                        id: player.id,
                        username: player.username,
                    });
                });

                GamePvPFactory.createGameRoom(matchId, playersToAdd);
                
                this.stopCountdown(match);
                this.removePreparingMatch(match.id);
            }

        } else if (action === 'decline') {
            this.declineMatch(match, user);
            match.players.forEach(player => {
                if (player.id !== user.id) {
                    SseManager.sendEvent(player.id, 'user-update', {username: user.username, status: 'declined'});
                }
            });

            this.cancelMatchByDecline(match);
        }
    }
    
    static acceptMatch(match, user) {
        const index = match.players.findIndex(player => player.id === user.id);
        if (index !== -1) {
            match.players[index].status = 'accepted';
        }
    }

    static declineMatch(match, user) {
        const index = match.players.findIndex(player => player.id === user.id);
        if (index !== -1) {
            match.players[index].status = 'declined';
        }
    }

    static haveAllUsersAccepted(match) {
        return match.players.every(player => player.status === 'accepted');
    }

    static startCountdown(match) {
        match.intervalId = setInterval(() => {
            match.countdown--;
            if (match.countdown === 0) {
                clearInterval(match.intervalId);
                this.cancelMatchByCountdown(match);
            }
        }, 1 * 1000);
    }

    static stopCountdown(match) {
        clearInterval(match.intervalId);
    }
    
    static cancelMatchByCountdown(match) {
        match.players.forEach(player => {
            if (player.status === 'accepted') {
                Queue.backToQueue(player.id);
            } else {
                Queue.remove(player.id);
            }
            SseManager.sendEvent(player.id, 'match-cancelled-by-countdown');
        });

        this.removePreparingMatch(match.id);
    }

    static cancelMatchByDecline(match) {
        match.players.forEach(player => {
            if (player.status === 'declined') {
                Queue.remove(player.id);
            } else {
                Queue.backToQueue(player.id);
            }
            SseManager.sendEvent(player.id, 'match-cancelled-by-decline');
        });

        this.stopCountdown(match);
        this.removePreparingMatch(match.id);
    }

    static removePreparingMatch(matchId) {
        this.preparingMatches = this.preparingMatches.filter(preparingMatch => preparingMatch.id !== matchId);
    }
}