const express = require('express');
const app     = express();
const PORT    = 3000;

app.use(express.json());

const empresaRoutes = require('./routes/empresa.js');
const setorRoutes   = require('./routes/setor.js');

app.use('/api/empresa', empresaRoutes);
app.use('/api/setor',   setorRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});