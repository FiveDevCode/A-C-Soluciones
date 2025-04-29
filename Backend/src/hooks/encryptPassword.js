import bcrypt from 'bcrypt';

// funcion para encriptar la contraseña 
//export const encryptPasswordHook = async (tecnico) => {
/*  if (tecnico.contrasenia) {
    // Generar un 'salt' para encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    // Encriptar la contraseña antes de guardarla
    tecnico.contrasenia = await bcrypt.hash(tecnico.contrasenia, salt);
  }
*/
//};

const SALT_ROUNDS = 10;

export const encryptPasswordHook = async (instance, options) => {
  if (instance.changed('contrasenia')) {
    const hashedPassword = await bcrypt.hash(instance.contrasenia, SALT_ROUNDS);
    instance.contrasenia = hashedPassword;
  }
};