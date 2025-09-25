import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import proveedoresRoutes from "./routes/proveedor.routes.js";
import eventosRoutes from "./routes/evento.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
