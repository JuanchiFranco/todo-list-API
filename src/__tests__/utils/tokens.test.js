import { describe, it, jest } from '@jest/globals';

import { generateToken, verifyToken } from '../../utils/tokens.js';

describe('generateToken function', () => {
    it('should generate a token', () => {
        const user = { id: 1, email: 'john.doe@example.com' };
        const token = generateToken(user);
        expect(token).toBeDefined();
    });
});

describe('verifyToken function', () => {
    it('should verify a valid token', () => {
        const user = { id: 1, email: 'john.doe@example.com' };
        const token = generateToken(user);
        const decoded = verifyToken(token);
        expect(decoded).toEqual({ id: 1, email: 'john.doe@example.com', iat: expect.any(Number), exp: expect.any(Number) });
    });

    it('should return null for an invalid token', () => {
        const decoded = verifyToken('invalidToken');
        expect(decoded).toBeNull();
    });
});