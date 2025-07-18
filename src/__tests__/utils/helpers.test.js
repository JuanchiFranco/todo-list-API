import { describe, it, jest } from '@jest/globals';

import { encryptPassword, comparePasswords } from '../../utils/helpers.js';

describe('encryptPassword function', () => {
    it('should encrypt a password', async () => {
        const plainPassword = 'password123';
        const hashedPassword = await encryptPassword(plainPassword);
        
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toEqual(plainPassword);
    });
});

describe('comparePasswords function', () => {
    it('should return true for matching passwords', async () => {
        const plainPassword = 'password123';
        const hashedPassword = await encryptPassword(plainPassword);

        const result = await comparePasswords(plainPassword, hashedPassword);
        expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
        const result = await comparePasswords('password123', 'wronghashedpassword');
        expect(result).toBe(false);
    });
});