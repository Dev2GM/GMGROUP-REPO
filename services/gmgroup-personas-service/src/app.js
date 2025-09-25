const express = require('express');
const cors = require('cors'); // 👉 importar cors
const app = express();
const personasRoutes = require('./routes/persona.routes');
const locationRoutes = require('./routes/location.routes');

// 👉 habilitar CORS
app.use(cors());

app.use(express.json());
app.use('/api/personas', personasRoutes);
app.use('/api/location', locationRoutes);

module.exports = app;
