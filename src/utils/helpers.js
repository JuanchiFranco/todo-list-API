import bcrypt from 'bcrypt';

async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export { encryptPassword, comparePasswords };