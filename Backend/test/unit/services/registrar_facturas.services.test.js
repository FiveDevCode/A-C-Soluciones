
import { RegistroFacturaService } from '../../../src/services/registrar_facturas.services.js';
import { RegistroFacturaRepository } from '../../../src/repository/registrar_facturas.repository.js';

// Mock a la dependencia RegistroFacturaRepository
jest.mock('../../../src/repository/registrar_facturas.repository.js');

describe('RegistroFacturaService', () => {
  let registroFacturaService;
  let mockRegistroFacturaRepository;

  beforeEach(() => {
    // Antes de cada prueba, creamos una nueva instancia del mock y del servicio
    mockRegistroFacturaRepository = new RegistroFacturaRepository();
    registroFacturaService = new RegistroFacturaService();
    // Nos aseguramos de que el servicio use la instancia mockeada del repositorio
    registroFacturaService.registroFacturaRepository = mockRegistroFacturaRepository;
  });

  afterEach(() => {
    // Limpiamos todos los mocks después de cada prueba
    jest.clearAllMocks();
  });

  // Pruebas para el método crearRegistroFactura
  describe('crearRegistroFactura', () => {
    it('debe llamar a crearRegistroFactura del repositorio con los datos correctos', async () => {
      const data = { numero_factura: 'F-001', monto: 100 };
      const expectedResponse = { id: 1, ...data };
      // Configuramos el mock para que devuelva un valor esperado
      mockRegistroFacturaRepository.crearRegistroFactura.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.crearRegistroFactura(data);

      // Verificamos que el método del repositorio fue llamado con los datos correctos
      expect(mockRegistroFacturaRepository.crearRegistroFactura).toHaveBeenCalledWith(data);
      // Verificamos que el servicio devuelve el resultado esperado
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistroPorCliente
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

  // Pruebas para el método obtenerRegistroPorId
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

  // Pruebas para el método obtenerRegistros
  describe('obtenerRegistros', () => {
    it('debe llamar a obtenerRegistros del repositorio', async () => {
      const expectedResponse = [{ id: 1, numero_factura: 'F-001' }];
      mockRegistroFacturaRepository.obtenerRegistros.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerRegistros();

      expect(mockRegistroFacturaRepository.obtenerRegistros).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistroPorNumero
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

  // Pruebas para el método obtenerPorSaldoPendiente
  describe('obtenerPorSaldoPendiente', () => {
    it('debe llamar a obtenerPorSaldoPendiente del repositorio', async () => {
      const expectedResponse = [{ id: 1, saldo_pendiente: 50 }];
      mockRegistroFacturaRepository.obtenerPorSaldoPendiente.mockResolvedValue(expectedResponse);

      const result = await registroFacturaService.obtenerPorSaldoPendiente();

      expect(mockRegistroFacturaRepository.obtenerPorSaldoPendiente).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerPorEstado
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

  // Pruebas para el método actualizarRegistroFactura
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

  // Pruebas para el método eliminarRegistroFactura
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
