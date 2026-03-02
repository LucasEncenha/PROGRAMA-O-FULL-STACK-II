require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const authRoutes =require('./routes/auth.js')
const empresaRoutes = require('./routes/empresa.js');
const setorRoutes   = require('./routes/setor.js');
const notasRoutes   = require('./routes/notas_fiscais.js');
const produtoRoutes   = require('./routes/produto.js');

app.use('/auth', authRoutes);

const autenticar = require('./middlewares/auth.js');

app.use('/api/empresa', autenticar, empresaRoutes);

app.use('/api', autenticar, notasRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});