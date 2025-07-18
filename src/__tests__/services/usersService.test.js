import { describe, it, jest } from '@jest/globals';

const MockPrisma = {
    user: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn()
    }
}

const MockGenerateToken = jest.fn();

const MockComparePasswords = jest.fn();
const MockEncryptPassword = jest.fn();

jest.unstable_mockModule('../../config/db.js', () => ({
    prisma: MockPrisma
}));

jest.unstable_mockModule('../../utils/tokens.js', () => ({
    generateToken: MockGenerateToken
}));

jest.unstable_mockModule('../../utils/helpers.js', () => ({
    comparePasswords: MockComparePasswords,
    encryptPassword: MockEncryptPassword
}));

const { register, login } = await import("../../services/usersService.js");

describe('register function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should register a new user and return a token', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
        MockPrisma.user.create.mockResolvedValueOnce(mockUser);
        MockGenerateToken.mockReturnValueOnce('mocked_token');
        MockEncryptPassword.mockResolvedValueOnce('hashed_password');

        const result = await register({ name: 'Test User', email: 'test@example.com', password: 'password' });

        expect(MockPrisma.user.create).toHaveBeenCalledWith({
            data: { email: 'test@example.com', password: expect.any(String), name: 'Test User' }
        });
        expect(MockGenerateToken).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual({ success: true, token: 'mocked_token' });
    });

    it('should return an error if user registration fails', async () => {
        MockPrisma.user.create.mockResolvedValueOnce(null);

        const result = await register({ name: 'Test User', email: 'test@example.com', password: 'password' });

        expect(result).toEqual({ success: false, message: 'Error al registrar el usuario' });
    });
});

describe('login function', () => {
    beforeEach(() => {
        jest.resetModules(); // Borra la caché de imports
        jest.clearAllMocks(); // Limpia los mocks
    });

    it('should login a user and return a token', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashed_password' };
        MockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
        MockGenerateToken.mockReturnValueOnce('mocked_token');
        MockComparePasswords.mockResolvedValueOnce(true);

        const result = await login({ email: 'test@example.com', password: 'hashed_password' });

        expect(MockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' }
        });
        expect(MockGenerateToken).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual({ success: true, token: 'mocked_token' });
    });

    it('should return an error if user login fails', async () => {
        MockPrisma.user.findUnique.mockResolvedValueOnce(null);

        const result = await login({ email: 'test@example.com', password: 'password' });

        expect(result).toEqual({ success: false, message: 'Credenciales inválidas' });
    });

    it('should return an error if password is invalid', async () => {
        const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashed_password' };
        MockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
        MockComparePasswords.mockResolvedValueOnce(false);

        const result = await login({ email: 'test@example.com', password: 'wrong_password' });

        expect(MockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' }
        });
        expect(MockComparePasswords).toHaveBeenCalledWith('wrong_password', mockUser.password);
        expect(result).toEqual({ success: false, message: 'Credenciales inválidas' });
    });
});
