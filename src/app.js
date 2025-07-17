import express from 'express';
import usersRoutes from './routes/users.routes.js';
import todosRoutes from './routes/todos.routes.js';
import 'dotenv/config';

const app = express();

async function startServer() {
    try {
        const PORT = process.env.PORT || 3000;

        app.use(express.json());
        app.use(express.static('public'));

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