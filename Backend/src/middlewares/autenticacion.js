
import { AuthService } from '../services/usuario.services.js';

const authService = new AuthService();

// Middleware de autenticación que verifica el token JWT
export const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = await authService.verifyToken(token);
    
    // Adjuntar el usuario decodificado a la solicitud
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    
    const message = error.name === 'TokenExpiredError' 
      ? 'Token expirado' 
      : 'Token inválido';
    
    return res.status(401).json({ 
      success: false,
      message 
    });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    console.log(`Rol recibido: "${req.user.rol}"`);


    // Si no se especifican roles, permitir acceso a cualquier rol autenticado
    if (roles.length === 0) {
      return next();
    }

    // Normalizar comparación de roles (case insensitive)
    const userRole = req.user.rol.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());

    // Verificar si el usuario tiene alguno de los roles requeridos
    if (!allowedRoles.includes(userRole)) {
      console.warn(`Intento de acceso no autorizado. Rol: ${userRole}, Ruta: ${req.path}`);
      
      return res.status(403).json({ 
        success: false,
        message: `Acceso denegado. Se requieren los roles: ${roles.join(', ')}` 
      });
      
    }
    
    next();
  };
};

// Exportar middlewares de autorización para roles específicos
export const isAdmin = authorize(['admin', 'administrador']);
export const isTecnico = authorize(['tecnico']);
export const isCliente = authorize(['cliente']);
export const isAdminOrTecnico = authorize(['admin', 'administrador', 'tecnico']);
export const isAdminOrCliente = authorize(['admin', 'administrador', 'cliente']);