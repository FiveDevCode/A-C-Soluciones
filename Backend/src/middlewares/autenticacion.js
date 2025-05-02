import jwt from 'jsonwebtoken';

const verificarToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(403).json({ error: 'Token requerido' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
};

export default verificarToken;