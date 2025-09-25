import multer from "multer";
import path from "path";
import fs from "fs";

// Carpeta destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/eventos";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

export const uploadEventoImage = multer({ storage, fileFilter });
