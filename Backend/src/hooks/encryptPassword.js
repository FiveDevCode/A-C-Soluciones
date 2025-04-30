import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const encryptPasswordHook = async (instance, options) => {
  if (instance.changed('contrasenia')) {
    const hashedPassword = await bcrypt.hash(instance.contrasenia, SALT_ROUNDS);
    instance.contrasenia = hashedPassword;
  }
};
