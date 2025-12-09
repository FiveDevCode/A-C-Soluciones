
import { AuthService } from '../services/usuario.services.js';

const authService = new AuthService();

// Middleware de autenticación que verifica el token JWT
export const authenticate = async (req, res, next) => {
  console.log(`🔐 Ejecutando authenticate en: ${req.method} ${req.originalUrl}`);
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    console.log('Authorization header recibido:', authHeader ? authHeader.substring(0, 30) + '...' : 'NO PRESENTE');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token no proporcionado' 
      });
    }
    
    // Limpiar el header de espacios adicionales y verificar formato
    const cleanHeader = authHeader.trim();
    
    if (!cleanHeader.toLowerCase().startsWith('bearer ')) {
      console.log('⚠️ Header no empieza con "Bearer ". Header completo:', cleanHeader.substring(0, 50));
      return res.status(400).json({ 
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    const token = cleanHeader.substring(7).trim(); // Extraer después de "Bearer "
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token vacío' 
      });
    }
    
    console.log('Token extraído (primeros 20 chars):', token.substring(0, 20) + '...');
    
    // Verificar el token
    console.log('Intentando verificar token...');
    const decoded = await authService.verifyToken(token);
    console.log('✓ Token verificado correctamente. Usuario:', decoded.id, 'Rol:', decoded.rol);
    
    // Adjuntar el usuario decodificado a la solicitud
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    console.error('Stack:', error.stack);
    
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
export const isContador = authorize(['contador']);
export const isAdminOrTecnico = authorize(['admin', 'administrador', 'tecnico']);
export const isAdminOrCliente = authorize(['admin', 'administrador', 'cliente']);
export const isAdminOrContador = authorize(['admin', 'administrador', 'contador']);
export const isAdminOrContadorOrTecnico = authorize(['admin','administrador','contador','tecnico']);
export const isTecnicoOrCliente = authorize(['tecnico', 'cliente']);
export const isAdminOrTecnicoOrCliente = authorize(['admin', 'administrador', 'tecnico', 'cliente']);