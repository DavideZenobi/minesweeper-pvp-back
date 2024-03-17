import mysql from 'mysql2';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const sessionDbConfig = {
    clearExpired: true,
    checkExpirationInterval: 10 * 1000,
    endConnectionOnClose: true,
    createDatabaseTable: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data',
        }
    }
}

const pool = mysql.createPool(dbConfig);
export const sessionStore = new (MySQLStore(session))(sessionDbConfig, pool);

export default pool.promise();