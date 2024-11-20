const express = require('express');
const router = require('./routes');
require('dotenv').config();

const app = express();
const port = 8080;

// HOST dari environment variables, default '127.0.0.1'
const host = process.env.HOST || '127.0.0.1';

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan rute
app.use(router);

// Jalankan server
app.listen(port, host,  () => {
  console.log(`Server berjalan di http://${host}:${port}`);
});