import { Router } from "express";
import { getProveedores, createProveedor, calificarProveedor } from "../controllers/proveedor.controller.js";
import {authenticate, optionalAuth} from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", optionalAuth, getProveedores);
router.post("/", authenticate, createProveedor);
router.post("/:id/calificar", authenticate, calificarProveedor);

export default router;
