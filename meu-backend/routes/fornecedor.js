const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/fornecedores', async (req, res) => {
    try {
        let sql = `SELECT * FROM fornecedores`;

        const [resultado] = await pool.query(sql);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;