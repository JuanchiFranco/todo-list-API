import { register, login } from '../services/usersService.js';

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

        const tokenUser = await register({ name, email, password });

        if (!tokenUser.success) {
            return res.status(400).json({ error: tokenUser.message });
        }

        return res.status(201).json({ token: tokenUser.token });
    } catch (error) {
        console.error('Error registrando usuario:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
        }   

        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

        const tokenUser = await login({ email, password });
        
        if (!tokenUser.success) {
            return res.status(401).json({ error: tokenUser.message });
        }

        return res.status(200).json({ token: tokenUser.token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export { registerUser, loginUser };
