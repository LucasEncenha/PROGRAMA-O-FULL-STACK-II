require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());

const authRoutes =require('./routes/auth.js')
const empresaRoutes = require('./routes/empresa.js');
const setorRoutes   = require('./routes/setor.js');
const notasRoutes   = require('./routes/notas_fiscais.js');
const produtoRoutes   = require('./routes/produto.js');
const fornecedorRoutes   = require('./routes/fornecedor.js');

app.use('/auth', authRoutes);
app.use(cors());

const autenticar = require('./middlewares/auth.js');

app.use('/api/empresa', autenticar, empresaRoutes);

app.use('/api', notasRoutes);
app.use('/api', fornecedorRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});