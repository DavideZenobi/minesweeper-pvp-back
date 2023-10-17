import { LobbyModel } from "../models/LobbyModel.js";

export class LobbyController {

    static async getAll(req, res) {
        const lobbies = await LobbyModel.getAll();
        res.json(lobbies);
    }

    static async getById (req, res) {
        const lobby = await LobbyModel.getById(req.params.id);
        res.json(lobby);
    }
    
    static async create (req, res) {

    }

    static async delete (req, res) {

    }

    static async update (req, res) {
        
    }
}