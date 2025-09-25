const express = require("express");
const cors = require("cors");

const categoriasRoutes = require("./routes/categoria.routes");
const tareaRoutes = require("./routes/tarea.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
app.use("/api/tareas", tareaRoutes);


module.exports = app;
