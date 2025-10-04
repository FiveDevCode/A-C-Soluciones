import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import router from "../../../src/routers/contable.routes.js";

// Mock del controlador y middlewares
jest.mock("../../../src/controllers/contable.controller.js", () => {
  return {
    ContableController: jest.fn().mockImplementation(() => ({
      crearContable: jest.fn((req, res) => res.status(201).json({ message: "Contable creado" })),
      obtenerContables: jest.fn((req, res) => res.status(200).json([{ id: 1, nombre: "Juan" }])),
      obtenerTecnicoPorId: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
      obtenerContablePorcedula: jest.fn((req, res) => res.status(200).json({ cedula: req.params.numero_de_cedula })),
      actualizarContable: jest.fn((req, res) => res.status(200).json({ id: req.params.id, actualizado: true })),
    })),
  };
});

// Mock de middlewares
jest.mock("../../../src/middlewares/autenticacion.js", () => ({
  authenticate: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));


describe("Contable Routes", () => {

  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  it("POST /api/contable → debe crear un contable", async () => {
    const res = await request(app)
      .post("/api/contable")
      .send({ nombre: "Juan", apellido: "Perez" });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Contable creado");
  });

  it("GET /api/contable → debe obtener lista de contables", async () => {
    const res = await request(app).get("/api/contable");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
  });

  it("GET /api/contable/:id → debe obtener contable por ID", async () => {
    const res = await request(app).get("/api/contable/10");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("10");
  });

  it("GET /api/contable/cedula/:numero_de_cedula → debe obtener contable por cédula", async () => {
    const res = await request(app).get("/api/contable/cedula/123456");
    expect(res.status).toBe(200);
    expect(res.body.cedula).toBe("123456");
  });

  it("PUT /api/contable/:id → debe actualizar un contable", async () => {
    const res = await request(app)
      .put("/api/contable/5")
      .send({ nombre: "Actualizado" });
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("5");
    expect(res.body.actualizado).toBe(true);
  });
});
