const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.get('/produtos', async (req, res) => {
    try {
        const [resultado] = await pool.query(`
            SELECT p.*, f.forn_nome 
            FROM produtos p
            LEFT JOIN fornecedores f ON p.id_fornecedor = f.forn_id
        `);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get('/produtos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, f.forn_nome 
            FROM produtos p
            LEFT JOIN fornecedores f ON p.id_fornecedor = f.forn_id
            WHERE p.prod_id = ?
        `, [req.params.id]);

        if (rows.length === 0)
            return res.status(404).json({ erro: 'Produto não encontrado' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.post('/produtos', async (req, res) => {
    const { prod_nome, prod_codigo_barras, prod_estoque_atual, prod_preco_venda, id_fornecedor } = req.body;

    if (!prod_nome || !prod_codigo_barras || !prod_preco_venda)
        return res.status(400).json({ erro: 'Nome, código de barras e preço são obrigatórios' });

    try {
        const [result] = await pool.query(
            'INSERT INTO produtos (prod_nome, prod_codigo_barras, prod_estoque_atual, prod_preco_venda, id_fornecedor) VALUES (?,?,?,?,?)',
            [prod_nome, prod_codigo_barras, prod_estoque_atual || 0, prod_preco_venda, id_fornecedor || null]
        );
        res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ erro: 'Este código de barras já está cadastrado' });
        res.status(500).json({ erro: err.message });
    }
});

router.put('/produtos/:id', async (req, res) => {
    const { prod_nome, prod_codigo_barras, prod_estoque_atual, prod_preco_venda, id_fornecedor } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE produtos SET prod_nome=?, prod_codigo_barras=?, prod_estoque_atual=?, prod_preco_venda=?, id_fornecedor=? WHERE prod_id=?',
            [prod_nome, prod_codigo_barras, prod_estoque_atual, prod_preco_venda, id_fornecedor || null, req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Produto não encontrado' });

        res.json({ mensagem: 'Produto atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete('/produtos/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM produtos WHERE prod_id = ?', [req.params.id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Produto não encontrado' });

        res.json({ mensagem: 'Produto excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;