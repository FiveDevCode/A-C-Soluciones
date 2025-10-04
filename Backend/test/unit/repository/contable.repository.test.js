import { jest } from "@jest/globals";
import { ContableRepository } from "../../../src/repository/contable.repository.js";
import { ContableModel } from "../../../src/models/contable.model.js";

// Mock del modelo Sequelize
jest.mock("../../../src/models/contable.model", () => ({
  ContableModel: {
    Contable: {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

describe("ContableRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new ContableRepository();
    jest.clearAllMocks();
  });

  it("debería encontrar un contable por email", async () => {
    const fakeContable = { id: 1, correo_electronico: "test@mail.com" };
    ContableModel.Contable.findOne.mockResolvedValue(fakeContable);

    const result = await repository.findByEmail("test@mail.com");

    expect(ContableModel.Contable.findOne).toHaveBeenCalledWith({
      where: { correo_electronico: "test@mail.com" },
    });
    expect(result).toEqual(fakeContable);
  });

  it("debería crear un contable", async () => {
    const data = { nombre: "Juan", correo_electronico: "juan@mail.com" };
    ContableModel.Contable.create.mockResolvedValue(data);

    const result = await repository.crearContable(data);

    expect(ContableModel.Contable.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it("debería obtener un contable por ID", async () => {
    const contable = { id: 1, nombre: "Maria" };
    ContableModel.Contable.findByPk.mockResolvedValue(contable);

    const result = await repository.obtenerContablePorId(1);

    expect(ContableModel.Contable.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(contable);
  });

  it("debería obtener un contable por cédula", async () => {
    const contable = { id: 2, numero_de_cedula: "12345" };
    ContableModel.Contable.findOne.mockResolvedValue(contable);

    const result = await repository.obtenerContablePorCedula("12345");

    expect(ContableModel.Contable.findOne).toHaveBeenCalledWith({
      where: { numero_de_cedula: "12345" },
    });
    expect(result).toEqual(contable);
  });

  it("debería obtener un contable por correo", async () => {
    const contable = { id: 3, correo_electronico: "carlos@mail.com" };
    ContableModel.Contable.findOne.mockResolvedValue(contable);

    const result = await repository.obtenerContablePorCorreo("carlos@mail.com");

    expect(ContableModel.Contable.findOne).toHaveBeenCalledWith({
      where: { correo_electronico: "carlos@mail.com" },
    });
    expect(result).toEqual(contable);
  });

  it("debería obtener todos los contables", async () => {
    const contables = [
      { id: 1, nombre: "Ana" },
      { id: 2, nombre: "Luis" },
    ];
    ContableModel.Contable.findAll.mockResolvedValue(contables);

    const result = await repository.obtenerContables();

    expect(ContableModel.Contable.findAll).toHaveBeenCalled();
    expect(result).toEqual(contables);
  });

  it("debería actualizar un contable existente", async () => {
    const contable = {
      id: 1,
      nombre: "Viejo Nombre",
      update: jest.fn().mockResolvedValue({ id: 1, nombre: "Nuevo Nombre" }),
    };

    ContableModel.Contable.findByPk.mockResolvedValue(contable);

    const result = await repository.actualizarContable(1, { nombre: "Nuevo Nombre" });

    expect(ContableModel.Contable.findByPk).toHaveBeenCalledWith(1);
    expect(contable.update).toHaveBeenCalledWith({ nombre: "Nuevo Nombre" });
    expect(result).toEqual({ id: 1, nombre: "Nuevo Nombre" });
  });

  it("debería devolver null si el contable no existe al actualizar", async () => {
    ContableModel.Contable.findByPk.mockResolvedValue(null);

    const result = await repository.actualizarContable(999, { nombre: "X" });

    expect(ContableModel.Contable.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });
});
