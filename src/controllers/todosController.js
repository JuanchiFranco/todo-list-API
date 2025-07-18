import { getAllTodos, create, update, deleteTodo as deleteTodoPending } from '../services/todosService.js';

async function getTodos(req, res) {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const userId = req.user.id; // Get the authenticated user ID
        const todos = await getAllTodos(userId, page, limit);

        return res.json({ todos: todos.todos, page, limit, total: todos.total });
    } catch (error) {
        console.error('Error buscando todos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createTodo(req, res) {
    try {
        const { title, description = '' } = req.body;
        const userId = req.user.id; // Get the authenticated user ID
        if (!title) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

        const newTodo = await create(userId, title, description);
        if (!newTodo.success) return res.status(500).json({ error: newTodo.message });
        return res.status(201).json({ todo: newTodo.todo });
    } catch (error) {
        console.error('Error creando todo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateTodo(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user.id; // Get the authenticated user ID

        if (!title || !description) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

        const updatedTodo = await update(userId, id, title, description);
        if (!updatedTodo.success) return res.status(403).json({ error: updatedTodo.message });
        return res.json({ todo: updatedTodo.todo });
    } catch (error) {
        console.error('Error actualizando todo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Get the authenticated user ID

        const result = await deleteTodoPending(userId, id);
        if (!result.success) return res.status(403).json({ error: result.message });
        return res.json({ message: 'Todo eliminado con éxito' });
    } catch (error) {
        console.error('Error eliminando todo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export { getTodos, createTodo, updateTodo, deleteTodo };