import { AuthService } from '../services/usuario.services.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { correo_electronico, contrasenia } = req.body;
      
      const result = await this.authService.login(correo_electronico, contrasenia);
      
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: error.message || 'Error en la autenticación' });
    }
  };

  verify = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
      }
      
      const decoded = await this.authService.verifyToken(token);
      return res.status(200).json(decoded);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  };
}