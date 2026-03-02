const mysql = require('mysql2/promise');
require('dotenv').config(); // Garante que carregou aqui também

console.log("--- DEBUG DE CONEXÃO ---");
console.log("Variável DB_PORT no .env:", process.env.DB_PORT);

const pool = mysql.createPool({
    host:     '127.0.0.1', 
    port:     3307, // FORÇADO MANUALMENTE PARA O DOCKER
    user:     'root',
    password: 'root',
    database: 'controle_estoque',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query('SHOW TABLES')
  .then(([rows]) => {
    console.log("📂 Tabelas que o Node consegue enxergar neste banco:", rows);
  });

module.exports = pool;