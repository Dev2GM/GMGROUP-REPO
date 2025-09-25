import { Router } from "express";
import { getEventos, createEvento } from "../controllers/evento.controller.js";
import {authenticate, optionalAuth} from '../middlewares/auth.middleware.js';
import { uploadEventoImage } from "../middlewares/uploads.middleware.js";

const router = Router();

router.get("/", optionalAuth, getEventos);
router.post(
  "/",
  authenticate,
  uploadEventoImage.single("imagen"),
  createEvento
);


export default router;
