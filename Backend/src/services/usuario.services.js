import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/administrador.model.js';
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ContabilidadModel } from '../models/contabilidad.model.js';
import SibApiV3Sdk from 'sib-api-v3-sdk'

export class AuthService {
  async login(correo, contrasenia) {
    try {
      
      if (!correo?.trim() || !contrasenia?.trim()) {
        throw new Error('Correo y contraseña son requeridos');
      }

      const [admin, cliente, tecnico, contabilidad] = await Promise.all([
        AdminModel.Admin.findOne({
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'rol', 'estado']
        }),
        ClienteModel.Cliente.findOne({ 
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'rol', 'estado']
        }),
        TecnicoModel.Tecnico.findOne({
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'especialidad', 'rol', 'estado']
        }),
        ContabilidadModel.Contabilidad.findOne({
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'rol', 'estado']
        })
      ]);

      const user = admin || cliente || tecnico || contabilidad;
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // validar que el empleado este activo para para ingresar a el sistema 
      if (tecnico?.correo_electronico && tecnico.estado === 'inactivo') {
        throw new Error('El empleado no está activo para ingresar al sistema');
      }

      if (admin?.correo_electronico && admin.estado === 'inactivo') {
        throw new Error('El administrador no está activo para ingresar al sistema');
      }

      if (cliente?.correo_electronico && cliente.estado === 'inactivo') {
        throw new Error('El cliente no está activo para ingresar al sistema');
      }

      if (contabilidad?.correo_electronico && contabilidad.estado === 'inactivo') {
        throw new Error('El Contador no está activa para ingresar al sistema');
      }

      // Verificación de contraseña con hash
      if (!user.contrasenia?.startsWith('$2b$')) {
        throw new Error('Credenciales no válidas (formato incorrecto)');
      }

      const passwordMatch = await bcrypt.compare(contrasenia.trim(), user.contrasenia);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }

      // Generación de token con más datos útiles
      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol,
          email: user.correo_electronico,
          nombre: user.nombre,
          ...(user.especialidad && { especialidad: user.especialidad }) // Campo adicional para técnicos
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return {
        token,
        user: {
          id: user.id,
          rol: user.rol,
          nombre: user.nombre,
          email: user.correo_electronico,
          ...(user.especialidad && { especialidad: user.especialidad })
        }
      };
    } catch (error) {
      console.error('Error en AuthService.login:', {
        message: error.message,
        correo,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificación adicional de estructura del token
      if (!decoded.id || !decoded.rol || !decoded.email) {
        throw new Error('Token inválido: estructura incorrecta');
      }
      
      return decoded;
    } catch (error) {
      console.error('Error en verifyToken:', {
        message: error.message,
        token: token?.slice(0, 20), // Log parcial del token por seguridad
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

// Método para enviar código de recuperación de contraseña
async sendRecoveryCode(correo) {
  if (!correo?.trim()) {
    throw new Error('El correo es requerido');
  }

  const correoNormalizado = correo.trim().toLowerCase();

  const user = await this._findUserByEmail(correoNormalizado);
  if (!user) throw new Error('Usuario no encontrado');

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await user.update({
    recovery_code: code,
    recovery_expires: expires
  });

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { name: 'A & C Soluciones', email: process.env.EMAIL_SENDER },
      to: [{ email: correoNormalizado }],
      subject: 'Recuperación de contraseña – A & C Soluciones',
      htmlContent: `<div style="font-family: Arial, sans-serif; color: #333;">
        <p style="font-size: 18px;">👋 Hola, ${user.nombre} ${user.apellido}</p>

        <p style="font-size: 16px;">
          🔐 Tu código de recuperación es: 
          <span style="font-weight: bold; color: #2F80ED; font-size: 18px;">${code}</span>
        </p>

        <p style="font-size: 16px;">
          ⏰ Este código es válido por 
          <strong>15 minutos</strong>.
        </p>

        <p style="margin-top: 30px; font-size: 14px;">
          Saludos,<br>
          <strong>Equipo de Soporte</strong><br>
          🏢 <em>A &amp; C Soluciones</em>
        </p>
      </div>`
    });  
  }

  // Método para restablecer la contraseña
  async resetPassword(correo_electronico, code, newPassword) {
    const correo = correo_electronico?.trim().toLowerCase();
    const user = await this._findUserByEmail(correo);
    if (!user) throw new Error('Usuario no encontrado');

    if (
      !user.recovery_code ||
      user.recovery_code !== code ||
      new Date(user.recovery_expires) < new Date()
    ) {
      throw new Error('Código inválido o expirado');
    }

    const hashed = await bcrypt.hash(newPassword.trim(), 10);
    await user.update({
      contrasenia: hashed,
      recovery_code: null,
      recovery_expires: null
    });
  }


// Método para verificar el código de recuperación
async verifyRecoveryCode(correo_electronico, code) {
  if (typeof correo_electronico !== 'string') {
    throw new Error('El correo electrónico es inválido o no fue proporcionado');
  }
  const correo = correo_electronico.trim().toLowerCase();

  const user = await this._findUserByEmail(correo);
  if (!user) throw new Error('Usuario no encontrado');

  const storedCode = String(user.recovery_code);
  const inputCode = String(code);

  if (!storedCode) throw new Error('No hay código guardado');

  if (storedCode !== inputCode) {
    throw new Error('Código incorrecto');
  }

  if (new Date(user.recovery_expires) < new Date()) {
    throw new Error('Código expirado');
  }

  return true;
}


  // Utilidad para buscar usuario entre los tres modelos
  async _findUserByEmail(correo) {
    const [admin, cliente, tecnico] = await Promise.all([
      AdminModel.Admin.findOne({ where: { correo_electronico: correo.trim().toLowerCase() } }),
      ClienteModel.Cliente.findOne({ where: { correo_electronico: correo.trim().toLowerCase() } }),
      TecnicoModel.Tecnico.findOne({ where: { correo_electronico: correo.trim().toLowerCase() } })
    ]);
    return admin || cliente || tecnico || null;
  }



}