const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host:     '127.0.0.1', 
    port:     3307,
    user:     'root',
    password: 'root',
    database: 'controle_estoque',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;