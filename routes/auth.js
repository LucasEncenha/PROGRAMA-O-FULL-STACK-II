const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

router.post('/registro', async (req, res) => {
    const { nome, cnpj, endereco, senha } = req.body;
    
    if (!nome || !cnpj || !endereco || !senha) {
        return res.status(400).json({ erro: 'Nome, CNPJ, endereço e senha são obrigatórios' });
    }
        
    try {
        const hash = await bcrypt.hash(senha, 10);
        
        const [result] = await pool.query(
            'INSERT INTO empresa (em_nome, em_cnpj, em_endereco, em_senha) VALUES (?, ?, ?, ?)',
            [nome, cnpj, endereco, hash]
        );
        
        res.status(201).json({ mensagem: 'Empresa cadastrada com sucesso!', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este CNPJ já está cadastrado' });
        }
        res.status(500).json({ erro: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { cnpj, senha } = req.body;
    
    try {
        const [rows] = await pool.query(
            'SELECT * FROM empresa WHERE em_cnpj = ?', [cnpj]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const ok = await bcrypt.compare(senha, rows[0].em_senha);
        
        if (!ok) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: rows[0].em_id, nome: rows[0].em_nome },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;