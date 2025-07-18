import { describe, it, jest } from '@jest/globals';

const mockVerifyToken = jest.fn();
jest.unstable_mockModule('../../utils/tokens.js', () => ({
  verifyToken: mockVerifyToken
}));

const { accessTokenMiddleware } = await import("../../middlewares/accesTokenMiddleware.js");

describe('accessTokenMiddleware function', () => {
    beforeEach(() => {
        jest.resetModules(); // Clear module cache
        jest.clearAllMocks(); // Clear all mocks
    });

    it('should call next if token is valid', async () => {
        const mockDecoded = { userId: 1, email: 'john.doe@example.com' };
        mockVerifyToken.mockResolvedValueOnce(mockDecoded);

        const req = {
            headers: {
                authorization: 'Bearer mockToken'
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        const next = jest.fn();

        await accessTokenMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(mockDecoded);
        expect(mockVerifyToken).toHaveBeenCalledWith('mockToken');
    });

    it('should return 401 if token is not provided', async () => {
        const req = {
            headers: {}
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        const next = jest.fn();

        await accessTokenMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', async () => {
        mockVerifyToken.mockResolvedValueOnce(null);

        const req = {
            headers: {
                authorization: 'Bearer mockToken'
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        const next = jest.fn();

        await accessTokenMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
        expect(mockVerifyToken).toHaveBeenCalledWith('mockToken');
    });

});
