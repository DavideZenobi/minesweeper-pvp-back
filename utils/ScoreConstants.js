export const OPEN_CELL_SCORE = 2;
export const CORRECT_FLAGGED_CELL_SCORE = 0.2;
const HARD_MAX_TIME = 420;
const HARD_MIN_TIME = 150;

// El multiplicador será un valor entre 1 y 2, ambos incluidos
export const calculateTimeMultiplier = (time) => {
    if (time <= HARD_MIN_TIME) {
        return 2;
    } else if (time <= HARD_MAX_TIME) {
        return 2 - ((time - HARD_MIN_TIME) / (HARD_MAX_TIME - HARD_MIN_TIME));
    } else {
        return 1;
    }
}