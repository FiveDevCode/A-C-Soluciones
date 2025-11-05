import { RegistrarCuentasRepository } from '../../../src/repository/registrar_cuentas.repository.js';
import { RegistroCuentaModel } from '../../../src/models/registrar_cuentas.model.js';

// Mock al modelo RegistroCuentaModel
jest.mock('../../../src/models/registrar_cuentas.model.js', () => ({
  RegistroCuentaModel: {
    RegistroCuenta: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

describe('RegistrarCuentasRepository', () => {
  let registrarCuentasRepository;

  beforeEach(() => {
    registrarCuentasRepository = new RegistrarCuentasRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Prueba para crearRegistroCuenta
  describe('crearRegistroCuenta', () => {
    it('debe llamar a RegistroCuenta.create con los datos correctos', async () => {
      const data = { numero_cuenta: '123456', saldo: 1000 };
      const expectedResponse = { id: 1, ...data };
      RegistroCuentaModel.RegistroCuenta.create.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.crearRegistroCuenta(data);

      expect(RegistroCuentaModel.RegistroCuenta.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para obtenerCuentaPorId
  describe('obtenerCuentaPorId', () => {
    it('debe llamar a RegistroCuenta.findAll con el id_cliente correcto', async () => {
      const id_cliente = 1;
      const expectedResponse = [{ id: 1, id_cliente }];
      RegistroCuentaModel.RegistroCuenta.findAll.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.obtenerCuentaPorId(id_cliente);

      expect(RegistroCuentaModel.RegistroCuenta.findAll).toHaveBeenCalledWith({ where: { id_cliente } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para obtenerCuentaPorIdCuenta
  describe('obtenerCuentaPorIdCuenta', () => {
    it('debe llamar a RegistroCuenta.findByPk con el id correcto', async () => {
      const id = 1;
      const expectedResponse = { id, numero_cuenta: '123456' };
      RegistroCuentaModel.RegistroCuenta.findByPk.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.obtenerCuentaPorIdCuenta(id);

      expect(RegistroCuentaModel.RegistroCuenta.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para obtenerCuentaPorNumero
  describe('obtenerCuentaPorNumero', () => {
    it('debe llamar a RegistroCuenta.findOne con el número de cuenta', async () => {
      const numero_cuenta = '123456';
      const expectedResponse = { id: 1, numero_cuenta };
      RegistroCuentaModel.RegistroCuenta.findOne.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.obtenerCuentaPorNumero(numero_cuenta);

      expect(RegistroCuentaModel.RegistroCuenta.findOne).toHaveBeenCalledWith({ where: { numero_cuenta } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para obtenerCuentaPorNit
  describe('obtenerCuentaPorNit', () => {
    it('debe llamar a RegistroCuenta.findOne con el NIT correcto', async () => {
      const nit = '900123456';
      const expectedResponse = { id: 1, nit };
      RegistroCuentaModel.RegistroCuenta.findOne.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.obtenerCuentaPorNit(nit);

      expect(RegistroCuentaModel.RegistroCuenta.findOne).toHaveBeenCalledWith({ where: { nit } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para obtenerCuentas
  describe('obtenerCuentas', () => {
    it('debe llamar a RegistroCuenta.findAll sin argumentos', async () => {
      const expectedResponse = [{ id: 1 }, { id: 2 }];
      RegistroCuentaModel.RegistroCuenta.findAll.mockResolvedValue(expectedResponse);

      const result = await registrarCuentasRepository.obtenerCuentas();

      expect(RegistroCuentaModel.RegistroCuenta.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Prueba para actualizarRegistroCuenta
  describe('actualizarRegistroCuenta', () => {
    it('debe actualizar y devolver el registro si se encuentra', async () => {
      const id = 1;
      const data = { saldo: 2000 };
      const mockRegistro = {
        update: jest.fn().mockResolvedValue({ id, ...data }),
      };
      RegistroCuentaModel.RegistroCuenta.findByPk.mockResolvedValue(mockRegistro);

      const result = await registrarCuentasRepository.actualizarRegistroCuenta(id, data);

      expect(RegistroCuentaModel.RegistroCuenta.findByPk).toHaveBeenCalledWith(id);
      expect(mockRegistro.update).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id, ...data });
    });

    it('debe devolver null si el registro no se encuentra', async () => {
      const id = 999;
      const data = { saldo: 2000 };
      RegistroCuentaModel.RegistroCuenta.findByPk.mockResolvedValue(null);

      const result = await registrarCuentasRepository.actualizarRegistroCuenta(id, data);

      expect(RegistroCuentaModel.RegistroCuenta.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  // Prueba para eliminarRegistroCuenta
  describe('eliminarRegistroCuenta', () => {
    it('debe eliminar y devolver el registro si se encuentra', async () => {
      const id = 1;
      const mockRegistro = {
        destroy: jest.fn().mockResolvedValue(),
      };
      RegistroCuentaModel.RegistroCuenta.findByPk.mockResolvedValue(mockRegistro);

      const result = await registrarCuentasRepository.eliminarRegistroCuenta(id);

      expect(RegistroCuentaModel.RegistroCuenta.findByPk).toHaveBeenCalledWith(id);
      expect(mockRegistro.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockRegistro);
    });

    it('debe devolver null si el registro no se encuentra', async () => {
      const id = 999;
      RegistroCuentaModel.RegistroCuenta.findByPk.mockResolvedValue(null);

      const result = await registrarCuentasRepository.eliminarRegistroCuenta(id);

      expect(RegistroCuentaModel.RegistroCuenta.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });
});
