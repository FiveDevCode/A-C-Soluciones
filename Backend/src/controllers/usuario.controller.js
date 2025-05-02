import { login } from '../services/usuario.services.js';

export const loginController = async (req, res) => {
  const { correo_electronico, contrasenia } = req.body;

  try {
    const result = await login(correo_electronico, contrasenia);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};