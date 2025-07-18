import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import usersRoutes from './routes/users.routes.js';
import todosRoutes from './routes/todos.routes.js';
import 'dotenv/config';

const app = express();

async function startServer() {
    try {
        const PORT = process.env.PORT || 3000;

        app.use(express.json());
        app.use(express.static('public'));

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Muchas solicitudes desde esta IP, por favor intente de nuevo más tarde.',
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false // Disable the `X-RateLimit-*` headers
        });

        const speedLimiter = slowDown({
            windowMs: 15 * 60 * 1000, // 15 minutes
            delayAfter: 100, // Begin delaying requests after 100 requests
            delayMs: (hits) => hits * 500, // Delay each request by 500ms
        });

        app.use(limiter);
        app.use(speedLimiter);

        app.get('/', (req, res) => {
            res.sendFile('index.html', { root: 'public' });
        });

        app.use('/api/users', usersRoutes);
        app.use('/api/todos', todosRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
}

startServer();