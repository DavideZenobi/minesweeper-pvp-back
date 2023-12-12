import cors from 'cors';

export const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true);
        }

        if (!origin) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true
})