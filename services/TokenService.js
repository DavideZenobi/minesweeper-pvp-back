import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { TokenModel } from '../models/TokenModel.js';

export const createToken = () => {
    const uuid = uuidv4();
    const date = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
    return {uuid: uuid, expirationTime: date};
}

export const isTokenValid = async (uuid) => {
    const token = await TokenModel.getByUUID(uuid);
    const actualDateTime = dayjs();
    if (actualDateTime.isBefore(token.expirationTime)) {
        return true;
    } else {
        return false;
    }
}