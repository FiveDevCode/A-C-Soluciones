import { RegistrarCuentasService } from '../../../src/services/registrar_cuentas.services.js';
import { RegistrarCuentasRepository } from '../../../src/repository/registrar_cuentas.repository.js';

jest.mock('../../../src/repository/registrar_cuentas.repository.js');

describe('RegistrarCuentasService', () => {
  let registrarCuentasService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      crearRegistroCuenta: jest.fn(),
      obtenerCuentaPorId: jest.fn(),
      obtenerCuentaPorIdCuenta: jest.fn(),
      obtenerCuentaPorNumero: jest.fn(),
      obtenerCuentaPorNit: jest.fn(),
      obtenerCuentas: jest.fn(),
      actualizarRegistroCuenta: jest.fn(),
      eliminarRegistroCuenta: jest.fn(),
    };

    RegistrarCuentasRepository.mockImplementation(() => mockRepository);
    registrarCuentasService = new RegistrarCuentasService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 Test crearRegistroCuenta
  it('debe crear un registro de cuenta', async () => {
    const data = { id_cliente: 1, numero_cuenta: '12345' };
    mockRepository.crearRegistroCuenta.mockResolvedValue(data);

    const result = await registrarCuentasService.crearRegistroCuenta(data);

    expect(result).toEqual(data);
    expect(mockRepository.crearRegistroCuenta).toHaveBeenCalledWith(data);
  });

  // 🔹 Test obtenerCuentaPorId
  it('debe obtener una cuenta por id_cliente', async () => {
    const cuenta = { id_cliente: 1, numero_cuenta: '12345' };
    mockRepository.obtenerCuentaPorId.mockResolvedValue(cuenta);

    const result = await registrarCuentasService.obtenerCuentaPorId(1);

    expect(result).toEqual(cuenta);
    expect(mockRepository.obtenerCuentaPorId).toHaveBeenCalledWith(1);
  });

  // 🔹 Test obtenerCuentaPorIdCuenta
  it('debe obtener una cuenta por id de cuenta', async () => {
    const cuenta = { id: 10, numero_cuenta: '12345' };
    mockRepository.obtenerCuentaPorIdCuenta.mockResolvedValue(cuenta);

    const result = await registrarCuentasService.obtenerCuentaPorIdCuenta(10);

    expect(result).toEqual(cuenta);
    expect(mockRepository.obtenerCuentaPorIdCuenta).toHaveBeenCalledWith(10);
  });

  // 🔹 Test obtenerCuentaPorNumero
  it('debe obtener una cuenta por número de cuenta', async () => {
    const cuenta = { id: 2, numero_cuenta: '67890' };
    mockRepository.obtenerCuentaPorNumero.mockResolvedValue(cuenta);

    const result = await registrarCuentasService.obtenerCuentaPorNumero('67890');

    expect(result).toEqual(cuenta);
    expect(mockRepository.obtenerCuentaPorNumero).toHaveBeenCalledWith('67890');
  });

  // 🔹 Test obtenerCuentaPorNit
  it('debe obtener una cuenta por NIT', async () => {
    const cuenta = { nit: '901234567-8', numero_cuenta: '55555' };
    mockRepository.obtenerCuentaPorNit.mockResolvedValue(cuenta);

    const result = await registrarCuentasService.obtenerCuentaPorNit('901234567-8');

    expect(result).toEqual(cuenta);
    expect(mockRepository.obtenerCuentaPorNit).toHaveBeenCalledWith('901234567-8');
  });

  // 🔹 Test obtenerCuentas
  it('debe obtener todas las cuentas', async () => {
    const cuentas = [
      { id: 1, numero_cuenta: '11111' },
      { id: 2, numero_cuenta: '22222' },
    ];
    mockRepository.obtenerCuentas.mockResolvedValue(cuentas);

    const result = await registrarCuentasService.obtenerCuentas();

    expect(result).toEqual(cuentas);
    expect(mockRepository.obtenerCuentas).toHaveBeenCalled();
  });

  // 🔹 Test actualizarRegistroCuenta
  it('debe actualizar un registro de cuenta', async () => {
    const id = 1;
    const data = { numero_cuenta: '99999' };
    const updated = { id, ...data };
    mockRepository.actualizarRegistroCuenta.mockResolvedValue(updated);

    const result = await registrarCuentasService.actualizarRegistroCuenta(id, data);

    expect(result).toEqual(updated);
    expect(mockRepository.actualizarRegistroCuenta).toHaveBeenCalledWith(id, data);
  });

  // 🔹 Test eliminarRegistroCuenta
  it('debe eliminar un registro de cuenta', async () => {
    const id = 1;
    mockRepository.eliminarRegistroCuenta.mockResolvedValue({ success: true });

    const result = await registrarCuentasService.eliminarRegistroCuenta(id);

    expect(result).toEqual({ success: true });
    expect(mockRepository.eliminarRegistroCuenta).toHaveBeenCalledWith(id);
  });
});
