const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha)
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE usu_email = ?', [email]
        );

        if (rows.length === 0)
            return res.status(401).json({ erro: 'Credenciais inválidas' });

        const ok = await bcrypt.compare(senha, rows[0].usu_senha);

        if (!ok)
            return res.status(401).json({ erro: 'Credenciais inválidas' });

        const token = jwt.sign(
            { id: rows[0].usu_id, nome: rows[0].usu_nome, cargo: rows[0].id_cargo },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.json({ token, usuario: { id: rows[0].usu_id, nome: rows[0].usu_nome, cargo: rows[0].id_cargo } });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get('/perfil', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ usuario: payload });
    } catch {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ mensagem: 'Logout realizado' });
});

module.exports = router;