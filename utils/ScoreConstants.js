export const OPEN_CELL_SCORE = 2;
export const CORRECT_FLAGGED_CELL_SCORE = 0.2;

const EASY_MAX_TIME = 60;
const EASY_MIN_TIME = 20;
const MEDIUM_MAX_TIME = 180;
const MEDIUM_MIN_TIME = 90; 
const HARD_MAX_TIME = 420;
const HARD_MIN_TIME = 150;

// El multiplicador será un valor entre 1 y 2, ambos incluidos
export const calculateTimeMultiplier = (level, time) => {
    switch (level) {
        case 'easy':
            if (time <= EASY_MIN_TIME) {
                return 2;
            } else if (time <= EASY_MAX_TIME) {
                return 2 - ((time - EASY_MIN_TIME) / (EASY_MAX_TIME - EASY_MIN_TIME));
            } else {
                return 1;
            }

        case 'medium':
            if (time <= MEDIUM_MIN_TIME) {
                return 2;
            } else if (time <= MEDIUM_MAX_TIME) {
                return 2 - ((time - MEDIUM_MIN_TIME) / (MEDIUM_MAX_TIME - MEDIUM_MIN_TIME));
            } else {
                return 1;
            }

        case 'hard':
            if (time <= HARD_MIN_TIME) {
                return 2;
            } else if (time <= HARD_MAX_TIME) {
                return 2 - ((time - HARD_MIN_TIME) / (HARD_MAX_TIME - HARD_MIN_TIME));
            } else {
                return 1;
            }

        default:
            break;
    }

    
}