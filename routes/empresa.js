const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
        SELECT
          e.em_id AS empresa_id,
          e.em_nome AS empresa_nome,
          s.set_id AS setor_id,
          s.set_nome AS setor_nome
        FROM empresa e
        INNER JOIN setores s
          ON e.em_id = s.em_id
        WHERE e.em_id = ?
      `, [id]
    );

    if (rows.length === 0){
      return res.status(404).json({ erro: 'Não encontrada' });
    }

    const empresas = {
      id: rows[0].empresa_id,
      nome: rows[0].empresa_nome,
      setores: rows.map(s=>({
        id: s.setor_id,
        nome: s.setor_nome
      }))
    }

    res.json(empresas);
    
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});



module.exports = router;