import { Matches } from "../minesweeperpvp/Matches.js";


export const ValidateUserAndMatch = (req, res, next) => {
    const userId = req.session.user.id;
    const matchId = req.params.matchId;
    const isUserValidated = Matches.validateUser(matchId, userId);
    const isMatchValidated = Matches.validateMatch(matchId);
    if (isUserValidated && isMatchValidated) {
        next();
    } else {
        return res.status(403).json({ message: 'This is not your match' });
    }
}