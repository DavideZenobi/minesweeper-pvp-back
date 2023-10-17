import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

const port = process.env.port ?? 3000;

app.listen(port, () => {
    console.log(`Hello, I am at por ${port}`);
})