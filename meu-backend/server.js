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

app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));
app.use('/auth', authRoutes);

const autenticar = require('./middlewares/auth.js');


app.use('/api/empresa', autenticar, empresaRoutes);
app.use('/api', autenticar, setorRoutes);
app.use('/api', autenticar, produtoRoutes);
app.use('/api', autenticar, notasRoutes);
app.use('/api', autenticar, fornecedorRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});