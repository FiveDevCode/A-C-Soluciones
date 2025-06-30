import { AuthService } from '../services/usuario.services.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();

    this.sendRecoveryCode = this.sendRecoveryCode.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.verifyRecoveryCode = this.verifyRecoveryCode.bind(this);
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

async sendRecoveryCode(req, res) {
  const { correo_electronico } = req.body;
  const correo = correo_electronico?.trim().toLowerCase();

  if (!correo) {
    return res.status(400).json({
      success: false,
      message: 'El correo es requerido'
    });
  }

  try {
    await this.authService.sendRecoveryCode(correo);
    res.json({ success: true, message: 'Código enviado al correo' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async resetPassword(req, res) {
  const correo = req.body.correo || req.body.correo_electronico;
  const { newPassword } = req.body;
  
  const code = req.body.code || req.body.recovery_code;


  try {
    await this.authService.resetPassword(correo, code, newPassword);
    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async verifyRecoveryCode(req, res) {
  const correo = req.body.correo || req.body.correo_electronico;

  const code = req.body.code || req.body.recovery_code;

  try {
    await this.authService.verifyRecoveryCode(correo, code);
    res.json({ success: true, message: 'Código válido' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

}