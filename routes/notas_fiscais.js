const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/notas', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT nf_id, nf_numero, nf_data_emissao, nf_fornecedor FROM notas_fiscais
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get('/notas/:id', async (req, res) => {
    try {
        const [notaRows] = await pool.query(`
            SELECT nf_id AS id, nf_numero, nf_data_emissao, nf_fornecedor FROM notas_fiscais
            WHERE nf_id = ?`, [req.params.id]
        );

        if (notaRows.length === 0)
            return res.status(404).json({ erro: 'Nota Fiscal não encontrada' });

        const [produtos] = await pool.query(`
            SELECT p.prod_id, p.prod_nome, p.prod_codigo_barras, m.quantidade, m.tipo_movimento
            FROM produtos p
            JOIN movimentacoes m ON m.id_produto = p.prod_id
            WHERE m.id_nota_fiscal = ?`, [req.params.id]
        );

        const nf = notaRows[0];
        res.json({
            id: nf.prod_id,  
            numero: nf.prod_codigo_barras,  
            dataEmissao: nf.nf_data_emissao,
            fornecedor: nf.nf_fornecedor,
            produtosMovimentados: produtos
        });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post('/notas', async (req, res) => {
    const { nf_numero, nf_fornecedor, nf_data_emissao, produtosMovimentados } = req.body;

    const conn = await pool.getConnection();
    
    try {
        await conn.beginTransaction();
        
        const [result] = await conn.query(
            'INSERT INTO notas_fiscais (nf_numero, nf_fornecedor, nf_data_emissao) VALUES (?,?,?)',
            [nf_numero, nf_fornecedor, nf_data_emissao]
        );
        const novoId = result.insertId;
        
        for (const item of produtosMovimentados) {
            await conn.query(
                'INSERT INTO movimentacoes (id_nota_fiscal, id_produto, quantidade, tipo_movimento) VALUES (?,?,?,?)',
                [novoId, item.id_produto, item.quantidade, item.tipo_movimento || 'ENTRADA']
            );
        }
        
        await conn.commit();
        res.status(201).json({ mensagem: 'Nota Fiscal e entrada de mercadorias registradas!', id: novoId });
        
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ erro: err.message });
    } finally { 
        conn.release();
    }
});

router.put('/notas/:id', async (req, res) => {
    const { nf_numero, nf_fornecedor, nf_data_emissao, produtosMovimentados } = req.body;
    const conn = await pool.getConnection();
    
    try {
        await conn.beginTransaction();
        
        await conn.query(
            'UPDATE notas_fiscais SET nf_numero=?, nf_fornecedor=?, nf_data_emissao=? WHERE nf_id=?',
            [nf_numero, nf_fornecedor, nf_data_emissao, req.params.id]
        );
        
        await conn.query(
            'DELETE FROM movimentacoes WHERE id_nota_fiscal=?', [req.params.id]
        );
        
        for (const item of produtosMovimentados) {
            await conn.query(
                'INSERT INTO movimentacoes (id_nota_fiscal, id_produto, quantidade, tipo_movimento) VALUES (?,?,?,?)',
                [req.params.id, item.id_produto, item.quantidade, item.tipo_movimento || 'ENTRADA']
            );
        }
        
        await conn.commit();
        res.json({ mensagem: 'Nota Fiscal e movimentações atualizadas com sucesso!' });
        
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ erro: err.message });
    } finally { 
        conn.release(); 
    }
});

router.delete('/notas/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM notas_fiscais WHERE nf_id = ?', [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Nota Fiscal não encontrada' });
        }

        res.json({ mensagem: 'Nota Fiscal e movimentações deletadas com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;