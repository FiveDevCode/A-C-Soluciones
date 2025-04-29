import { Router } from 'express';
import AuthController from '../controllers/usuario.controller';
import middlewares from '../middlewares/autenticacion';

const router = Router();

// Aplicar middlewares globales (CORS y headers de seguridad)
router.use(middlewares.configurarCORS);
router.use(middlewares.headersSeguridad);

// Rutas públicas (no requieren autenticación)
router.post(
  '/login',
  middlewares.limiterAuth, // Rate limiting (5 intentos cada 15 min)
  middlewares.validarCredenciales,
  AuthController.login
);

router.post(
  '/solicitar-recuperacion',
  middlewares.limiterAuth, // Rate limiting
  AuthController.solicitarRecuperacion
);

router.post(
  '/restablecer-contrasena',
  middlewares.validarTokenRecuperacion, // Ahora verifica en BD
  middlewares.validarNuevaContrasena,
  AuthController.restablecerPassword
);

router.post(
  '/verificar-token-recuperacion',
  middlewares.validarTokenRecuperacion,
  AuthController.verificarTokenRecuperacion
);

router.post(
  '/refresh-token',
  AuthController.refrescarToken
);

// Rutas protegidas (requieren autenticación)
router.post(
  '/logout',
  middlewares.verificarToken,
  AuthController.logout
);

router.get(
  '/verificar-sesion',
  middlewares.verificarToken,
  AuthController.verificarSesion
);

router.post(
  '/cambiar-contrasena',
  middlewares.verificarToken,
  middlewares.validarNuevaContrasena,
  AuthController.cambiarContrasena
);

// Rutas para administración de usuarios (solo admin)
router.get(
  '/listar',
  middlewares.verificarToken,
  middlewares.verificarRol(['administrador']),
  AuthController.listarUsuarios
);

router.get(
  '/detalle/:id',
  middlewares.verificarToken,
  middlewares.verificarRol(['administrador']),
  AuthController.obtenerUsuario
);

router.post(
  '/crear',
  middlewares.verificarToken,
  middlewares.verificarRol(['administrador']),
  middlewares.validarCredenciales,
  AuthController.crearUsuario
);

router.put(
  '/actualizar/:id',
  middlewares.verificarToken,
  middlewares.verificarRol(['administrador']),
  AuthController.actualizarUsuario
);

router.delete(
  '/eliminar/:id',
  middlewares.verificarToken,
  middlewares.verificarRol(['administrador']),
  AuthController.eliminarUsuario
);

export default router;