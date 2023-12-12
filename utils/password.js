import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    const saltRounds = 10;

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

export const checkPassword = async (plainTextPassword, hashedPassword) => {
    return new Promise(async (resolve, reject) => {
        const result = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (result) {
            resolve(true);
        } else {
            reject(false);
        }
    })
}