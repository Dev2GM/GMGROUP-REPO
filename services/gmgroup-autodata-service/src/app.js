const express = require('express');
const cors = require('cors'); // 👉 importar cors
const app = express();
const autoData = require('./routes/autodata.routes');

// 👉 habilitar CORS
app.use(cors());

app.use(express.json());
app.use('/api/autodata', autoData);

module.exports = app;
