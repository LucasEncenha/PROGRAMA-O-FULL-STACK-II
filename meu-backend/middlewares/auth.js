const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({ erro: 'Token não fornecido' });

    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer')
        return res.status(401).json({ erro: 'Formato inválido. Use: Bearer ' });

    const token = partes[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (err) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
    }

module.exports = autenticar;