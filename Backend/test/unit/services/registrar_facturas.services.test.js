
import { RegistroFacturaService } from '../../../src/services/registrar_facturas.services.js';
import { RegistroFacturaRepository } from '../../../src/repository/registrar_facturas.repository.js';

// Mock a la dependencia RegistroFacturaRepository
jest.mock('../../../src/repository/registrar_facturas.repository.js');

describe('RegistroFacturaService', () => {
  let registroFacturaService;
  let mockRegistroFacturaRepository;

  beforeEach(() => {
    mockRegistroFacturaRepository = new RegistroFacturaRepository();
    registroFacturaService = new RegistroFacturaService();
    registroFacturaService.registroFacturaRepository = mockRegistroFacturaRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para el metodo registro facturas
  describe('crearRegistroFactura', () => {
    it('debe llamar a crearRegistroFactura del repositorio con los datos correctos', async () => {
      const data = { numero_factura: 'F-001', monto: 100 };
      const expectedResponse = { id: 1, ...data };
      mockRegistroFacturaRepository.crearRegistroFactura.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.crearRegistroFactura(data);

      expect(mockRegistroFacturaRepository.crearRegistroFactura).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo obtener registro or cliente
  describe('obtenerRegistroPorCliente', () => {
    it('debe llamar a obtenerRegistroPorCliente del repositorio con el id del cliente', async () => {
      const id_cliente = 1;
      const expectedResponse = [{ id: 1, id_cliente: 1, numero_factura: 'F-001' }];
      mockRegistroFacturaRepository.obtenerRegistroPorCliente.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerRegistroPorCliente(id_cliente);

      expect(mockRegistroFacturaRepository.obtenerRegistroPorCliente).toHaveBeenCalledWith(id_cliente);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo registro por ID
  describe('obtenerRegistroPorId', () => {
    it('debe llamar a obtenerRegistroPorId del repositorio con el id correcto', async () => {
      const id = 1;
      const expectedResponse = { id: 1, numero_factura: 'F-001' };
      mockRegistroFacturaRepository.obtenerRegistroPorId.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerRegistroPorId(id);

      expect(mockRegistroFacturaRepository.obtenerRegistroPorId).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo obtener registros
  describe('obtenerRegistros', () => {
    it('debe llamar a obtenerRegistros del repositorio', async () => {
      const expectedResponse = [{ id: 1, numero_factura: 'F-001' }];
      mockRegistroFacturaRepository.obtenerRegistros.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerRegistros();

      expect(mockRegistroFacturaRepository.obtenerRegistros).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo obtener registro Por Numero
  describe('obtenerRegistroPorNumero', () => {
    it('debe llamar a obtenerRegistroPorNumero del repositorio con el número de factura', async () => {
      const numero_factura = 'F-001';
      const expectedResponse = { id: 1, numero_factura: 'F-001' };
      mockRegistroFacturaRepository.obtenerRegistroPorNumero.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerRegistroPorNumero(numero_factura);

      expect(mockRegistroFacturaRepository.obtenerRegistroPorNumero).toHaveBeenCalledWith(numero_factura);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo obtener por saldo pendiente
  describe('obtenerPorSaldoPendiente', () => {
    it('debe llamar a obtenerPorSaldoPendiente del repositorio', async () => {
      const expectedResponse = [{ id: 1, saldo_pendiente: 50 }];
      mockRegistroFacturaRepository.obtenerPorSaldoPendiente.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerPorSaldoPendiente();

      expect(mockRegistroFacturaRepository.obtenerPorSaldoPendiente).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo obtener por estado
  describe('obtenerPorEstado', () => {
    it('debe llamar a obtenerPorEstado del repositorio con el estado de la factura', async () => {
      const estado_factura = 'pendiente';
      const expectedResponse = [{ id: 1, estado_factura: 'pendiente' }];
      mockRegistroFacturaRepository.obtenerPorEstado.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerPorEstado(estado_factura);

      expect(mockRegistroFacturaRepository.obtenerPorEstado).toHaveBeenCalledWith(estado_factura);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo actualizar registro factura
  describe('actualizarRegistroFactura', () => {
    it('debe llamar a actualizarRegistroFactura del repositorio con el id y los datos correctos', async () => {
      const id = 1;
      const data = { monto: 150 };
      const expectedResponse = { id: 1, monto: 150 };
      mockRegistroFacturaRepository.actualizarRegistroFactura.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.actualizarRegistroFactura(id, data);

      expect(mockRegistroFacturaRepository.actualizarRegistroFactura).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el metodo eliminar registro factura
  describe('eliminarRegistroFactura', () => {
    it('debe llamar a eliminarRegistroFactura del repositorio con el id correcto', async () => {
      const id = 1;
      const expectedResponse = { id: 1 };
      mockRegistroFacturaRepository.eliminarRegistroFactura.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.eliminarRegistroFactura(id);

      expect(mockRegistroFacturaRepository.eliminarRegistroFactura).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });
});
