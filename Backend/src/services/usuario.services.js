import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UsuarioRepository } from '../repository/usuario.repository.js';
import { TecnicoRepository } from '../repository/tecnico.repository.js';
import { ClienteRepository } from '../repository/cliente.repository.js';

// Crear instancias de los repositorios
const usuarioRepo = new UsuarioRepository();
const tecnicoRepo = new TecnicoRepository();
const clienteRepo = new ClienteRepository();

export const login = async (correo_electronico, contrasenia) => {
  let user = await usuarioRepo.findByEmail(correo_electronico); // Usamos la instancia de UsuarioRepository
  let rol = 'administrador';

  if (!user) {
    user = await tecnicoRepo.findByEmail(correo_electronico);
    rol = 'tecnico';
  }

  if (!user) {
    user = await clienteRepo.findByEmail(correo_electronico);
    rol = 'cliente';
  }

  if (!user) throw new Error('Usuario no encontrado');

  // Usamos la contraseña en la base de datos (clave) para compararla con la contraseña en texto plano proporcionada
  const clave = user.contrasenia || user.password;
  const correo = user.correo_electronico || user.email;

  const valid = await bcrypt.compare(contrasenia, clave); // Compara la contraseña en texto plano con la contraseña encriptada
  if (!valid) throw new Error('Contraseña incorrecta');

  const token = jwt.sign(
    { id: user.id, rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: correo,
      rol
    }
  };
};
