const express = require('express');
const cors = require('cors'); // 👉 importar cors
const app = express();
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require("./routes/group.routes")

// 👉 habilitar CORS
app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)

module.exports = app;
