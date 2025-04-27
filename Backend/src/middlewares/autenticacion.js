import jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import { models } from '../database/conexion';

// validaciones para el correo y contrasena para que el usuaio no vaya a cometer cagadas

function validarCorreoElectronico(correo) {
  const errores = [];

  if (!isEmail(correo)) {
    errores.push("El formato del correo electrónico es inválido");
  }

  if (correo.length > 320) {
    errores.push("El correo electrónico no debe exceder los 320 caracteres");
  }

  return errores;
}

function validarContrasena(contrasena) {
  const errores = [];

  if (contrasena.length < 8 || contrasena.length > 64) {
    errores.push("La contraseña debe tener entre 8 y 64 caracteres");
  }

  if (!/[A-Z]/.test(contrasena)) {
    errores.push("La contraseña debe contener al menos una letra mayúscula");
  }

  if (!/[a-z]/.test(contrasena)) {
    errores.push("La contraseña debe contener al menos una letra minúscula");
  }

  if (!/[0-9]/.test(contrasena)) {
    errores.push("La contraseña debe contener al menos un número");
  }

  if (!/[@#$%&*!]/.test(contrasena)) {
    errores.push("La contraseña debe contener al menos un carácter especial (@, #, $, %, &, *, !)");
  }

  if (/\s/.test(contrasena)) {
    errores.push("La contraseña no debe contener espacios en blanco");
  }

  const secuenciasPredecibles = ['123456', 'abcdef', 'qwerty'];
  if (secuenciasPredecibles.some(seq => contrasena.toLowerCase().includes(seq))) {
    errores.push("La contraseña no debe contener secuencias predecibles");
  }

  if (/(.)\1{2,}/.test(contrasena)) {
    errores.push("La contraseña no debe contener muchos caracteres repetidos seguidos");
  }

  return errores;
}

// Middleware principal

const validarCredenciales = (req, res, next) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ 
      error: "Por favor, complete todos los campos obligatorios" 
    });
  }

  const errores = [
    ...validarCorreoElectronico(correo),
    ...validarContrasena(contrasena)
  ];

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  next();
};

export default {
  validarCredenciales
};
