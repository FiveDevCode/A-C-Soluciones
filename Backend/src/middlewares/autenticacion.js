import jwt from 'jsonwebtoken';
const { verify } = jwt;

import validator from 'validator';
const { isEmail } = validator;

import rateLimit from 'express-rate-limit';
import { sequelize } from '../database/conexion.js'; // ✅ Correcto

// Mensajes de error
const ERROR_MESSAGES = {
  CREDENCIALES_INCOMPLETAS: 'Correo electrónico y contraseña son requeridos',
  EMAIL_INVALIDO: 'Formato de correo electrónico inválido',
  CONTRASENA_INVALIDA: 'La contraseña no cumple con los requisitos',
  TOKEN_FALTANTE: 'Token de autenticación requerido',
  TOKEN_INVALIDO: 'Token inválido o expirado',
  TOKEN_REVOCADO: 'Este token ha sido revocado',
  NO_AUTORIZADO: 'Acceso no autorizado',
  PERMISO_DENEGADO: 'No tienes permiso para este recurso',
  DEMASIADOS_INTENTOS: 'Demasiados intentos. Por favor, espera 15 minutos.',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado'
};

// Validaciones de la contraseña
const PASSWORD_REGEX = {
  MAYUSCULA: /[A-Z]/,
  MINUSCULA: /[a-z]/,
  NUMERO: /[0-9]/,
  ESPECIAL: /[@#$%&*!]/,
  ESPACIOS: /\s/,
  REPETIDOS: /(.)\1{2,}/
};

const SECUENCIAS_PREDECIBLES = ['123456', 'abcdef', 'qwerty'];

// Rate limiting para autenticación
export const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite por IP
  message: { error: ERROR_MESSAGES.DEMASIADOS_INTENTOS }
});

// Headers de seguridad
export const headersSeguridad = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'",
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*'
  });
  next();
};

// Configuracion CORS para frontend separado
export const configurarCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// Validacion de credenciales
export const validarCredenciales = (req, res, next) => {
  const { correo_electronico, contrasenia } = req.body;
  const errores = [];

  if (!correo_electronico || !contrasenia) {
    return res.status(400).json({ error: ERROR_MESSAGES.CREDENCIALES_INCOMPLETAS });
  }

  // Validación del correo
  if (!isEmail(correo_electronico)) {
    errores.push(ERROR_MESSAGES.EMAIL_INVALIDO);
  } else if (correo_electronico.length > 320) {
    errores.push('El correo no debe exceder 320 caracteres');
  }

  // Validación de contraseña
  if (contrasenia.length < 8 || contrasenia.length > 64) {
    errores.push('La contraseña debe tener entre 8-64 caracteres');
  } else {
    if (!PASSWORD_REGEX.MAYUSCULA.test(contrasenia)) errores.push('Requiere al menos una mayúscula');
    if (!PASSWORD_REGEX.MINUSCULA.test(contrasenia)) errores.push('Requiere al menos una minúscula');
    if (!PASSWORD_REGEX.NUMERO.test(contrasenia)) errores.push('Requiere al menos un número');
    if (!PASSWORD_REGEX.ESPECIAL.test(contrasenia)) errores.push('Requiere al menos un carácter especial');
    if (PASSWORD_REGEX.ESPACIOS.test(contrasenia)) errores.push('No debe contener espacios');
    if (PASSWORD_REGEX.REPETIDOS.test(contrasenia)) errores.push('No debe tener caracteres repetidos seguidos');
   
    const contienePredecible = SECUENCIAS_PREDECIBLES.some(seq =>
      contrasenia.toLowerCase().includes(seq)
    );
    if (contienePredecible) errores.push('No debe contener secuencias predecibles');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.CONTRASENA_INVALIDA,
      detalles: errores
    });
  }

  next();
};

// Middleware de verificación de token mejorado
export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: ERROR_MESSAGES.TOKEN_FALTANTE });
  }

  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Verificar si el token ha sido invalidado
    const Usuario = db.getModel('Usuario');
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: ERROR_MESSAGES.TOKEN_INVALIDO });
    }
    
    if (usuario.esTokenInvalidado(token)) {
      return res.status(401).json({ error: ERROR_MESSAGES.TOKEN_REVOCADO });
    }
    
    // Verificar si ha habido un cambio de contraseña
    const tokenIssuedAt = decoded.iat * 1000;
    const lastPasswordUpdate = usuario.ultima_actualizacion_contrasena?.getTime() || 0;
    
    if (tokenIssuedAt < lastPasswordUpdate) {
      return res.status(401).json({ 
        error: ERROR_MESSAGES.TOKEN_INVALIDO,
        detalles: 'La contraseña ha sido cambiada desde que se emitió este token' 
      });
    }
    
    req.usuario = decoded;
    req.tokenActual = token;
    next();
  } catch (err) {
    return res.status(401).json({
      error: ERROR_MESSAGES.TOKEN_INVALIDO,
      detalles: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
    });
  }
};

// Verificación de roles
export const verificarRol = (rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: ERROR_MESSAGES.NO_AUTORIZADO });
  }

  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({
      error: ERROR_MESSAGES.PERMISO_DENEGADO,
      rolRequerido: rolesPermitidos,
      rolActual: req.usuario.rol
    });
  }

  next();
};

// Validación de token de recuperacion
export const validarTokenRecuperacion = async (req, res, next) => {
  const { token } = req.body;
 
  if (!token) {
    return res.status(400).json({ error: ERROR_MESSAGES.TOKEN_FALTANTE });
  }

  try {
    const decoded = verify(token, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET);
    const Usuario = db.getModel('Usuario');
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario || !usuario.token_recuperacion || 
        new Date() > usuario.expiracion_token_recuperacion) {
      return res.status(401).json({ 
        error: ERROR_MESSAGES.TOKEN_INVALIDO,
        detalles: 'Token de recuperación inválido o expirado'
      });
    }
    
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: ERROR_MESSAGES.TOKEN_INVALIDO,
      detalles: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
    });
  }
};

// Validacin de nueva contra
export const validarNuevaContrasena = (req, res, next) => {
  const { nuevaContrasena } = req.body;
  const errores = [];

  if (!nuevaContrasena) {
    return res.status(400).json({ error: 'Nueva contraseña es requerida' });
  }

  if (nuevaContrasena.length < 8 || nuevaContrasena.length > 64) {
    errores.push('La contraseña debe tener entre 8-64 caracteres');
  } else {
    if (!PASSWORD_REGEX.MAYUSCULA.test(nuevaContrasena)) errores.push('Requiere al menos una mayúscula');
    if (!PASSWORD_REGEX.MINUSCULA.test(nuevaContrasena)) errores.push('Requiere al menos una minúscula');
    if (!PASSWORD_REGEX.NUMERO.test(nuevaContrasena)) errores.push('Requiere al menos un número');
    if (!PASSWORD_REGEX.ESPECIAL.test(nuevaContrasena)) errores.push('Requiere al menos un carácter especial');
    if (PASSWORD_REGEX.ESPACIOS.test(nuevaContrasena)) errores.push('No debe contener espacios');
    if (PASSWORD_REGEX.REPETIDOS.test(nuevaContrasena)) errores.push('No debe tener caracteres repetidos seguidos');
   
    const contienePredecible = SECUENCIAS_PREDECIBLES.some(seq =>
      nuevaContrasena.toLowerCase().includes(seq)
    );
    if (contienePredecible) errores.push('No debe contener secuencias predecibles');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.CONTRASENA_INVALIDA,
      detalles: errores
    });
  }

  next();
};

export default {
  limiterAuth,
  headersSeguridad,
  configurarCORS,
  validarCredenciales,
  verificarToken,
  verificarRol,
  validarTokenRecuperacion,
  validarNuevaContrasena
};