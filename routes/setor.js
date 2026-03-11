const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.post('/', async (req, res) => {
  try {
    const { nome, em_id } = req.body;

    if (!nome || !em_id)
      return res.status(400)
        .json({ erro: 'Campos obrigatórios ausentes' });

    const [cat] = await pool.query(
      'SELECT id FROM empresa WHERE em_id = ?', [em_id]
    );
    if (cat.length === 0)
      return res.status(400)
        .json({ erro: 'Empresa não encontrada' });

    const [result] = await pool.query(
      'INSERT INTO setores (set_nome, em_id) VALUES (?, ?)',
      [nome, em_id]
    );

    res.status(201).json({
      id: result.insertId, nome, em_id
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;