const express = require('express');
const cors = require('cors'); // 👉 importar cors
const app = express();
const DatosMonetarios = require('./routes/datos-monetarios.routes');
const polizaRouter = require("./routes/poliza.routes")

// 👉 habilitar CORS
app.use(cors());

app.use(express.json());
app.use('/api/datos-monetarios', DatosMonetarios);
app.use('/api/polizas', polizaRouter);

module.exports = app;
