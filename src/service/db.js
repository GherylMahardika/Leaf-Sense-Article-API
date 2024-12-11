const mysql = require('mysql2');

// Koneksi ke Cloud SQL
// Create a connection pool to Cloud SQL
const pool = mysql.createPool({
  host: '34.101.195.218', // Cloud SQL host
  user: 'leaf-sense-db', // Cloud SQL username
  password: 'n%c?3js9:fQU?udZ', // Cloud SQL password
  database: 'LeafSenseDB', // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
