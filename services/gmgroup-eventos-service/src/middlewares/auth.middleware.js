import axios from "axios";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.post(process.env.API_URL + "/api/auth/verify", { token });

    if (response.data.valid) {
      req.user = response.data.user; // id y username
      return next();
    } else {
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (err) {
    console.error("Error validando token:", err.message);
    return res.status(401).json({ message: "Token inválido o servicio auth no disponible" });
  }
};


export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    req.user = null; // visitante
    const ciudad = req.headers["city"];
    if (!ciudad) {
      return res.status(401).json({ message: "Token no proporcionado" });      
    }
    req.ciudad = ciudad;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    const ciudad = req.headers["city"];
    if (!ciudad) {
      return res.status(401).json({ message: "Token no proporcionado" });      
    }
    req.ciudad = ciudad;
    return next();
  }

  try {
    const response = await axios.post(process.env.API_URL + "/api/auth/verify", { token });

    if (response.data.valid) {
      req.user = response.data.user; // id y username
      return next();
    } else {
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (err) {
    console.error("Error validando token:", err.message);
    return res.status(401).json({ message: "Token inválido o servicio auth no disponible" });
  }

  next();
};