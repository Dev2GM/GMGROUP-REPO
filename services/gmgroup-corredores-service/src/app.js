const express = require('express');
const cors = require('cors');
const app = express();
const corredorRoutes = require('./routes/corredor.routes');
const canalesRoutes = require('./routes/canal.routes');
const ramosRoutes = require('./routes/ramo.routes');

app.use(cors());
app.use(express.json());

app.use('/api/corredores', corredorRoutes);
app.use('/api/canales', canalesRoutes);
app.use('/api/ramos', ramosRoutes);

module.exports = app;
