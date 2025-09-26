const express = require('express');
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require('cors');

const app = express();
app.use(cors());

// Redirige /api/users → microservicio de usuarios
app.use("/api/auth", createProxyMiddleware({ target: "http://localhost:3001/api/auth", changeOrigin: true }));
app.use("/api/users", createProxyMiddleware({ target: "http://localhost:3001/api/users", changeOrigin: true }));
app.use("/api/groups", createProxyMiddleware({ target: "http://localhost:3001/api/groups", changeOrigin: true }));

// Redirige /api/orders → microservicio de pedidos
app.use("/api/corredores", createProxyMiddleware({ target: "http://localhost:3002/api/corredores", changeOrigin: true }));
app.use("/api/canales", createProxyMiddleware({ target: "http://localhost:3002/api/canales", changeOrigin: true }));
app.use("/api/ramos", createProxyMiddleware({ target: "http://localhost:3002/api/ramos", changeOrigin: true }));

app.use("/api/personas", createProxyMiddleware({ target: "http://localhost:3003/api/personas", changeOrigin: true }));
app.use("/api/location", createProxyMiddleware({ target: "http://localhost:3003/api/location", changeOrigin: true }));
app.use("/api/prospeccion", createProxyMiddleware({ target: "http://localhost:3003/api/prospeccion", changeOrigin: true }));

app.use("/api/datos-monetarios", createProxyMiddleware({ target: "http://localhost:3004/api/datos-monetarios", changeOrigin: true }));
app.use("/api/polizas", createProxyMiddleware({ target: "http://localhost:3004/api/polizas", changeOrigin: true }));

app.use("/api/autodata", createProxyMiddleware({ target: "http://localhost:3005/api/autodata", changeOrigin: true }));

app.use("/api/tareas/categorias", createProxyMiddleware({ target: "http://localhost:3006/api/categorias", changeOrigin: true }));
app.use("/api/tareas", createProxyMiddleware({ target: "http://localhost:3006/api/tareas", changeOrigin: true }));

app.use("/api/eventos", createProxyMiddleware({ target: "http://localhost:3007/api/eventos", changeOrigin: true }));
app.use("/eventos/uploads", createProxyMiddleware({ target: "http://localhost:3007/uploads", changeOrigin: true }));
app.use("/api/proveedores", createProxyMiddleware({ target: "http://localhost:3007/api/proveedores", changeOrigin: true }));

app.use("/api/novedades", createProxyMiddleware({ target: "http://localhost:5000/api/novedades", changeOrigin: true }));
app.use("/api/faq", createProxyMiddleware({ target: "http://localhost:5000/api/faq", changeOrigin: true }));
app.use("/api/conocimiento_bot", createProxyMiddleware({ target: "http://localhost:5000/api/conocimiento_bot", changeOrigin: true }));
app.use("/api/materiales", createProxyMiddleware({ target: "http://localhost:5000/api/materiales", changeOrigin: true }));

app.listen(3000, '0.0.0.0', () => {
  console.log("API Gateway escuchando en http://localhost:3000");
});
