import { Router } from "express";

import { ServicioController } from "../controllers/servicio.controller.js";
//aaa 
const router = Router();

// ruta para registrar servicios
router.post("/api/servicio", ServicioController.crear);

// ruta para listar todos los servicios
router.get("/api/servicio", ServicioController.listar);

// ruta para obtener un solo servicio
router.get("/api/servicio/:id", ServicioController.obtenerPorId); 

// ruta para eliminar un servicio
router.delete("/api/servicio/:id", ServicioController.eliminar); 

// ruta para actualizar un servicio
router.put("/api/servicio/:id", ServicioController.actualizar);






export default router;



