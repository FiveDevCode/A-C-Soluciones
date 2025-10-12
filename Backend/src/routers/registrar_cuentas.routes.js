import { RegistrarCuentasController } from "../controllers/registrar_cuentas.controller.js";
import { Router } from "express";
import { authenticate, isAdmin, isAdminOrContador, isContador } from "../middlewares/autenticacion.js";

const router = Router();
const registrarCuentasController = new RegistrarCuentasController();

router.post("/api/registrar-cuenta", authenticate, isAdminOrContador, registrarCuentasController.crearRegistroCuenta);
router.get("/api/cuentas", authenticate, isAdminOrContador, registrarCuentasController.obtenerCuentas);
router.get("/api/cuentas-cliente/:id_cliente", authenticate, isAdminOrContador, registrarCuentasController.obtenerCuentaPorId);
router.get("/api/cuenta-id/:id", authenticate, isAdminOrContador, registrarCuentasController.obtenerCuentaPorIdCuenta);
router.get("/api/cuenta-numero/:numero_cuenta", authenticate, isAdminOrContador, registrarCuentasController.obtenerCuentaPorNumero);
router.get("/api/cuenta-nit/:nit", authenticate, isAdminOrContador, registrarCuentasController.obtenerCuentaPorNit);
router.put("/api/cuenta/:id", authenticate, isAdminOrContador, registrarCuentasController.actualizarRegistroCuenta);
router.delete("/api/eliminar-cuenta/:id", authenticate, isAdminOrContador, registrarCuentasController.eliminarRegistroCuenta);

export default router;