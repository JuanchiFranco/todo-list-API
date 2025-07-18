import { prisma } from '../config/db.js';

async function getAllTodos(userId, page = 1, limit = 10) {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });

        const totalTodos = await prisma.todo.count({ where: { userId } });
        
        const data = {
            success: true,
            todos: todos,
            total: totalTodos
        };
        return data;
    } catch (error) {
        console.error('Error buscando todos:', error);
        throw new Error('Error buscando todos');
    }
}

async function create(userId, title, description) {
    try {
        const newTodo = await prisma.todo.create({
            data: {
                userId,
                title,
                description
            }
        });

        return { success: true, todo: newTodo };
    } catch (error) {
        console.error('Error creando todo:', error);
        throw new Error('Error creando todo');
    }
}

async function update(userId, id, title, description) {
    try {
        const todoToUpdate = await prisma.todo.findUnique({
            where: { id: parseInt(id), userId }
        });

        if (!todoToUpdate) return { success: false, message: 'Este todo no existe o no te pertenece' };

        const updatedTodo = await prisma.todo.update({
            where: { id: parseInt(id), userId },
            data: { title, description }
        });

        return { success: true, todo: updatedTodo };
    } catch (error) {
        console.error('Error actualizando todo:', error);
        throw new Error('Error actualizando todo');
    }
}

async function deleteTodo(userId, id) {
    try {
        const todoToDelete = await prisma.todo.findUnique({
            where: { id: parseInt(id), userId }
        });

        if (!todoToDelete) return { success: false, message: 'Este todo no existe o no te pertenece' };

        await prisma.todo.delete({
            where: { id: parseInt(id), userId }
        });

        return { success: true, message: 'Todo eliminado con éxito' };
    } catch (error) {
        console.error('Error eliminando todo:', error);
        throw new Error('Error eliminando todo');
    }
}

export { getAllTodos, create, update, deleteTodo };