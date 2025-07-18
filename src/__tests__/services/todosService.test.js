import { describe, it, jest } from '@jest/globals';

const MockPrisma = {
    todo: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    }
}

jest.unstable_mockModule('../../config/db.js', () => ({
    prisma: MockPrisma
}));

const { getAllTodos, create, update, deleteTodo } = await import("../../services/todosService.js");

describe('getAllTodos function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should return all todos for a user', async () => {
        const mockTodos = [{ id: 1, title: 'Test Todo', description: 'Test Description' }];
        const mockCount = 1;
        MockPrisma.todo.findMany.mockResolvedValueOnce(mockTodos);
        MockPrisma.todo.count.mockResolvedValueOnce(mockCount);

        const userId = 1;
        const result = await getAllTodos(userId);

        expect(MockPrisma.todo.findMany).toHaveBeenCalledWith({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: 0,
            take: 10
        });
        expect(MockPrisma.todo.count).toHaveBeenCalledWith({ where: { userId } });
        expect(result).toEqual({ success: true, todos: mockTodos, total: mockCount });
    });

    it('should handle errors when fetching todos', async () => {
        MockPrisma.todo.findMany.mockRejectedValueOnce(new Error('Database error'));
        
        await expect(getAllTodos(1)).rejects.toThrow('Error buscando todos');
    });
});

describe('create function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should create a new todo', async () => {
        const mockTodo = { id: 1, title: 'New Todo', description: 'New Description' };
        MockPrisma.todo.create.mockResolvedValueOnce(mockTodo);

        const userId = 1;
        const title = 'New Todo';
        const description = 'New Description';
        const result = await create(userId, title, description);

        expect(MockPrisma.todo.create).toHaveBeenCalledWith({
            data: { userId, title, description }
        });
        expect(result).toEqual({ success: true, todo: mockTodo });
    });

    it('should handle errors when creating a todo', async () => {
        MockPrisma.todo.create.mockRejectedValueOnce(new Error('Database error'));
        
        await expect(create(1, 'New Todo', 'New Description')).rejects.toThrow('Error creando todo');
    });
});

describe('update function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should update an existing todo', async () => {
        const mockTodo = { id: 1, title: 'Updated Todo', description: 'Updated Description' };
        MockPrisma.todo.findUnique.mockResolvedValueOnce(mockTodo);
        MockPrisma.todo.update.mockResolvedValueOnce(mockTodo);

        const userId = 1;
        const id = 1;
        const title = 'Updated Todo';
        const description = 'Updated Description';
        const result = await update(userId, id, title, description);

        expect(MockPrisma.todo.update).toHaveBeenCalledWith({
            where: { id: parseInt(id), userId },
            data: { title, description }
        });
        expect(result).toEqual({ success: true, todo: mockTodo });
    });

    it('should return an error if the todo does not exist or does not belong to the user', async () => {
        MockPrisma.todo.findUnique.mockResolvedValueOnce(null);
        const userId = 1;
        const id = 1;
        const title = 'Updated Todo';
        const description = 'Updated Description';
        const result = await update(userId, id, title, description);
        expect(result).toEqual({ success: false, message: 'Este todo no existe o no te pertenece' });
    });

    it('should handle errors when updating a todo', async () => {
        MockPrisma.todo.findUnique.mockRejectedValueOnce(new Error('Todo not found'));

        await expect(update(1, 1, 'Updated Todo', 'Updated Description')).rejects.toThrow('Error actualizando todo');
    });
});

describe('deleteTodo function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should delete an existing todo', async () => {
        const mockTodo = { id: 1, title: 'Todo to delete', description: 'Description' };
        MockPrisma.todo.findUnique.mockResolvedValueOnce(mockTodo);
        MockPrisma.todo.delete.mockResolvedValueOnce(mockTodo);

        const userId = 1;
        const id = 1;
        const result = await deleteTodo(userId, id);

        expect(MockPrisma.todo.findUnique).toHaveBeenCalledWith({
            where: { id: parseInt(id), userId }
        });
        expect(MockPrisma.todo.delete).toHaveBeenCalledWith({
            where: { id: parseInt(id), userId }
        });
        expect(result).toEqual({ success: true, message: 'Todo eliminado con éxito' });
    });

    it('should return an error if the todo does not exist or does not belong to the user', async () => {
        MockPrisma.todo.findUnique.mockResolvedValueOnce(null);

        const userId = 1;
        const id = 1;
        const result = await deleteTodo(userId, id);
        expect(result).toEqual({ success: false, message: 'Este todo no existe o no te pertenece' });
    });

    it('should handle errors when deleting a todo', async () => {
        MockPrisma.todo.findUnique.mockRejectedValueOnce(new Error('Todo not found'));

        await expect(deleteTodo(1, 1)).rejects.toThrow('Error eliminando todo');
    });
});
