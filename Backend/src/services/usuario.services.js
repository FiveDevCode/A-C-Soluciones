
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/administrador.model.js';
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';


export class AuthService {
  async login(correo, contrasenia) {
    try {
      
      if (!correo?.trim() || !contrasenia?.trim()) {
        throw new Error('Correo y contraseña son requeridos');
      }


      const [admin, cliente, tecnico] = await Promise.all([
        AdminModel.Admin.findOne({
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'rol']
        }),
        ClienteModel.Cliente.findOne({ 
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'rol']
        }),
        TecnicoModel.Tecnico.findOne({
          where: { correo_electronico: correo.trim().toLowerCase() },
          attributes: ['id', 'nombre', 'correo_electronico', 'contrasenia', 'especialidad', 'rol', 'estado']
        })
      ]);

     
      const user = admin || cliente || tecnico;
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // validar que el empleado este activo para para ingresar a el sistema 
      if(tecnico && tecnico.correo_electronico === tecnico.correo_electronico && tecnico.estado === 'inactivo'){
        throw new Error('El empleado no está activo para ingresar al sistema');
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
        { expiresIn: '1h' }
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
}