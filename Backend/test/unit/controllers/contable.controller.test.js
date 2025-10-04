
import { ContableController } from "../../../src/controllers/contable.controller.js";
import { ContableService } from "../../../src/services/contable.services.js";
import { ValidationError } from "sequelize";

// Mock del servicio
jest.mock("../../../src/services/contable.services.js");

describe("ContableController", () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    ContableService.mockClear();
    controller = new ContableController();
    mockService = ContableService.mock.instances[0];

    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("crearContable", () => {
    it("debería devolver 400 si el contable ya existe", async () => {
      mockReq.body = { numero_de_cedula: "123" };
      mockService.obtenerContablePorcedula.mockResolvedValue({ id: 1 });

      await controller.crearContable(mockReq, mockRes);

      expect(mockService.obtenerContablePorcedula).toHaveBeenCalledWith("123");
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "El contable ya está registrado." });
    });

    it("debería crear un contable si no existe", async () => {
      mockReq.body = { numero_de_cedula: "123", nombre: "Juan" };
      mockService.obtenerContablePorcedula.mockResolvedValue(null);
      mockService.crearContable.mockResolvedValue({ id: 1, nombre: "Juan" });

      await controller.crearContable(mockReq, mockRes);

      expect(mockService.crearContable).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, nombre: "Juan" });
    });

    it("debería devolver 400 si hay un ValidationError", async () => {
      const validationError = new ValidationError("Validation failed", [
        { path: "correo_electronico", message: "Correo inválido" },
      ]);

      mockService.obtenerContablePorcedula.mockResolvedValue(null);
      mockService.crearContable.mockRejectedValue(validationError);

      await controller.crearContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { correo_electronico: "Correo inválido" },
      });
    });

    it("debería devolver 500 si ocurre un error inesperado", async () => {
      mockService.obtenerContablePorcedula.mockResolvedValue(null);
      mockService.crearContable.mockRejectedValue(new Error("DB error"));

      await controller.crearContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error al crear el empleado.",
      });
    });
  });

  describe("obtenerContablePorcedula", () => {
    it("debería devolver 200 si encuentra un contable", async () => {
      mockReq.params = { numero_de_cedula: "123" };
      mockService.obtenerContablePorcedula.mockResolvedValue({ id: 1, nombre: "Maria" });

      await controller.obtenerContablePorcedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ contable: { id: 1, nombre: "Maria" } });
    });

    it("debería devolver 404 si no encuentra el contable", async () => {
      mockReq.params = { numero_de_cedula: "999" };
      mockService.obtenerContablePorcedula.mockResolvedValue(null);

      await controller.obtenerContablePorcedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Empleado no encontrado" });
    });
  });

  describe("obtenerContables", () => {
    it("debería devolver lista de contables", async () => {
      const contables = [{ id: 1 }, { id: 2 }];
      mockService.obtenerContables.mockResolvedValue(contables);

      await controller.obtenerContables(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(contables);
    });
  });

  describe("actualizarContable", () => {
    it("debería actualizar un contable existente", async () => {
      mockReq.params = { id: 1 };
      mockReq.body = { nombre: "Nuevo" };
      mockService.actualizarContable.mockResolvedValue({ id: 1, nombre: "Nuevo" });

      await controller.actualizarContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, nombre: "Nuevo" });
    });

    it("debería devolver 404 si no existe el contable", async () => {
      mockReq.params = { id: 99 };
      mockService.actualizarContable.mockResolvedValue(null);

      await controller.actualizarContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Empleado no encontrado." });
    });

    it("debería devolver 400 si hay un ValidationError", async () => {
      const validationError = new ValidationError("Validation failed", [
        { path: "nombre", message: "Nombre requerido" },
      ]);

      mockService.actualizarContable.mockRejectedValue(validationError);

      await controller.actualizarContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { nombre: "Nombre requerido" },
      });
    });

    it("debería devolver 500 si ocurre un error inesperado", async () => {
      mockService.actualizarContable.mockRejectedValue(new Error("DB error"));

      await controller.actualizarContable(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error al actualizar el empleado.",
      });
    });
  });
});
