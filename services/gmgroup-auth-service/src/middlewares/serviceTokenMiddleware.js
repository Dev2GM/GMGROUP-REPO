module.exports = function(req, res, next) {
  const token = req.headers['x-service-token'];
  if (!token || token !== process.env.SERVICE_INTERNAL_TOKEN) {
    return res.status(403).json({ error: 'Token de servicio inválido' });
  }
  next();
};