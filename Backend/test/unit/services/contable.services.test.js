import { jest } from "@jest/globals";
import { ContableService } from "../../../src/services/contable.services.js";
import { ContableRepository } from "../../../src/repository/contable.repository.js";

// 🔹 Mock del ContableRepository
jest.mock("../../../src/repository/contable.repository.js");

describe("ContableService", () => {
  let contableService;
  let contableRepositoryMock;

  beforeEach(() => {
    // Reinicia mocks antes de cada test
    ContableRepository.mockClear();
    contableService = new ContableService();
    contableRepositoryMock = ContableRepository.mock.instances[0];
  });

  it("debería crear un contable", async () => {
    const data = { nombre: "Juan", cedula: "123" };
    contableRepositoryMock.crearContable.mockResolvedValue(data);

    const result = await contableService.crearContable(data);

    expect(contableRepositoryMock.crearContable).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it("debería obtener un contable por id", async () => {
    const contable = { id: 1, nombre: "Maria" };
    contableRepositoryMock.obtenerContablePorId.mockResolvedValue(contable);

    const result = await contableService.obtenerContablePorId(1);

    expect(contableRepositoryMock.obtenerContablePorId).toHaveBeenCalledWith(1);
    expect(result).toEqual(contable);
  });

  it("debería obtener un contable por cédula", async () => {
    const contable = { id: 2, nombre: "Pedro", cedula: "456" };
    contableRepositoryMock.obtenerContablePorCedula.mockResolvedValue(contable);

    const result = await contableService.obtenerContablePorcedula("456");

    expect(contableRepositoryMock.obtenerContablePorCedula).toHaveBeenCalledWith("456");
    expect(result).toEqual(contable);
  });

  it("debería obtener todos los contables", async () => {
    const contables = [
      { id: 1, nombre: "Ana" },
      { id: 2, nombre: "Luis" },
    ];
    contableRepositoryMock.obtenerContables.mockResolvedValue(contables);

    const result = await contableService.obtenerContables();

    expect(contableRepositoryMock.obtenerContables).toHaveBeenCalled();
    expect(result).toEqual(contables);
  });

  it("debería obtener un contable por correo", async () => {
    const contable = { id: 3, nombre: "Carlos", correo: "carlos@test.com" };
    contableRepositoryMock.obtenerContablePorCorreo.mockResolvedValue(contable);

    const result = await contableService.obtenerPorContableCorreo("carlos@test.com");

    expect(contableRepositoryMock.obtenerContablePorCorreo).toHaveBeenCalledWith("carlos@test.com");
    expect(result).toEqual(contable);
  });

  it("debería actualizar un contable", async () => {
    const updated = { id: 1, nombre: "Juan Actualizado" };
    contableRepositoryMock.actualizarContable.mockResolvedValue(updated);

    const result = await contableService.actualizarContable(1, { nombre: "Juan Actualizado" });

    expect(contableRepositoryMock.actualizarContable).toHaveBeenCalledWith(1, { nombre: "Juan Actualizado" });
    expect(result).toEqual(updated);
  });
});
