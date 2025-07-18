import { describe, it, jest } from '@jest/globals';

const mockGetAllTodos = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteTodo = jest.fn();

jest.unstable_mockModule('../../services/todosService.js', () => ({
    getAllTodos: mockGetAllTodos,
    create: mockCreate,
    update: mockUpdate,
    deleteTodo: mockDeleteTodo
}));

const { getTodos, createTodo, deleteTodo, updateTodo } = await import("../../controllers/todosController");

describe('getTodos function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });
    
    it('should return an array of todos empty', async () => {

        // Mock the service function to return an empty array with total 0 in this format { success: true, todos: [ total: 0 ] }
        const mockTodos = {
            success: true,
            todos: [],
            total: 0
        };
        mockGetAllTodos.mockResolvedValueOnce(mockTodos);

        const req = {
            user: { id: 1 },
            query: { page: '1', limit: '10' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await getTodos(req, res);

        expect(res.json).toHaveBeenCalledWith({
            todos: [],
            page: 1,
            limit: 10,
            total: 0
        });
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should return an status 500 when an error occurs", async () => {
        mockGetAllTodos.mockRejectedValueOnce(new Error('Error interno del servidor'));

        const req = {
            user: { id: 1 },
            query: { page: '1', limit: '10' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await getTodos(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

describe('createTodo function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should create a new todo successfully', async () => {
        const mockTodo = { id: 1, title: 'Test Todo', description: 'Test Description' };
        mockCreate.mockResolvedValueOnce({ success: true, todo: mockTodo });

        const req = {
            user: { id: 1 },
            body: { title: 'Test Todo', description: 'Test Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ todo: mockTodo });
    });

    it('should return status 400 when title is missing', async () => {
        const req = {
            user: { id: 1 },
            body: { description: 'Test Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });

    it('should return status 500 when an error occurs', async () => {
        mockCreate.mockRejectedValueOnce(new Error('Error interno del servidor'));

        const req = {
            user: { id: 1 },
            body: { title: 'Test Todo', description: 'Test Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });

    it('should return status 500 when create service returns an error with success false', async () => {
        mockCreate.mockResolvedValueOnce({ success: false, message: 'Error al crear el todo' });

        const req = {
            user: { id: 1 },
            body: { title: 'Test Todo', description: 'Test Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await createTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el todo' });
    });
});

describe('updateTodo function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should update a todo successfully', async () => {
        const mockTodo = { id: 1, title: 'Updated Todo', description: 'Updated Description' };
        mockUpdate.mockResolvedValueOnce({ success: true, todo: mockTodo });

        const req = {
            user: { id: 1 },
            params: { id: '1' },
            body: { title: 'Updated Todo', description: 'Updated Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await updateTodo(req, res);

        expect(res.json).toHaveBeenCalledWith({ todo: mockTodo });
    });

    it('should return status 400 when description is missing', async () => {
        const req = {
            user: { id: 1 },
            params: { id: '1' },
            body: { title: 'Updated Todo' } // Missing description
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });

    it("should return status 400 when title is missing", async () => {
        const req = {
            user: { id: 1 },
            params: { id: '1' },
            body: { description: 'Updated Description' } // Missing title
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });

    it('should return status 403 when todo does not exist or does not belong to user', async () => {
        mockUpdate.mockResolvedValueOnce({ success: false, message: 'Este todo no existe o no te pertenece' });

        const req = {
            user: { id: 1 },
            params: { id: '1' },
            body: { title: 'Updated Todo', description: 'Updated Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Este todo no existe o no te pertenece' });
    });

    it('should return status 500 when an error occurs', async () => {
        mockUpdate.mockRejectedValueOnce(new Error('Error interno del servidor'));

        const req = {
            user: { id: 1 },
            params: { id: '1' },
            body: { title: 'Updated Todo', description: 'Updated Description' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await updateTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

describe('deleteTodo function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should delete a todo successfully', async () => {
        mockDeleteTodo.mockResolvedValueOnce({ success: true, message: 'Todo eliminado con éxito' });

        const req = {
            user: { id: 1 },
            params: { id: '1' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteTodo(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Todo eliminado con éxito' });
    });

    it('should return status 403 when todo does not exist or does not belong to user', async () => {
        mockDeleteTodo.mockResolvedValueOnce({ success: false, message: 'Este todo no existe o no te pertenece' });

        const req = {
            user: { id: 1 },
            params: { id: '1' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Este todo no existe o no te pertenece' });
    });

    it('should return status 500 when an error occurs', async () => {
        mockDeleteTodo.mockRejectedValueOnce(new Error('Error interno del servidor'));

        const req = {
            user: { id: 1 },
            params: { id: '1' }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteTodo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

