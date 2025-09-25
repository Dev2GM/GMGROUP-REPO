import axios from "axios";

export const authenticate = async (req, res, next) => {
  const svcToken = req.headers['x-service-token'];
  const authHeader = req.headers["authorization"];
  let flag = false;
  if (!svcToken && !authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  if (svcToken && svcToken === process.env.SERVICE_INTERNAL_TOKEN) flag = true;
  
  if (!authHeader) {
    if (flag) {
      return next();
    }
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.post(`http://localhost:${process.env.PORT}/api/auth/verify`, { token });

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
