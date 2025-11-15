import { setContext, getContext, clearContext } from '../../../src/services/chatContext.services.js';

describe('Chat Context Service', () => {
  const sessionA = 'userA';
  const sessionB = 'userB';

  beforeEach(() => {
    // Limpia el contexto global entre tests
    clearContext(sessionA);
    clearContext(sessionB);
  });

  // ------------------------------------------------------------
  // setContext()
  // ------------------------------------------------------------
  it('debería establecer un contexto para una sesión', () => {
    setContext(sessionA, 'saludo');
    expect(getContext(sessionA)).toBe('saludo');
  });

  it('debería sobrescribir el contexto si ya existe', () => {
    setContext(sessionA, 'inicio');
    setContext(sessionA, 'ayuda');
    expect(getContext(sessionA)).toBe('ayuda');
  });

  // ------------------------------------------------------------
  // getContext()
  // ------------------------------------------------------------
  it('debería devolver undefined si no existe contexto para la sesión', () => {
    expect(getContext('sessionInexistente')).toBeUndefined();
  });

  it('debería devolver el contexto correcto para cada sesión', () => {
    setContext(sessionA, 'saludo');
    setContext(sessionB, 'despedida');

    expect(getContext(sessionA)).toBe('saludo');
    expect(getContext(sessionB)).toBe('despedida');
  });

  // ------------------------------------------------------------
  // clearContext()
  // ------------------------------------------------------------
  it('debería eliminar el contexto de una sesión', () => {
    setContext(sessionA, 'soporte');
    clearContext(sessionA);

    expect(getContext(sessionA)).toBeUndefined();
  });

  it('no debería lanzar error si se intenta eliminar una sesión inexistente', () => {
    expect(() => clearContext('inexistente')).not.toThrow();
  });

  // ------------------------------------------------------------
  // Flujo completo (integración de los 3 métodos)
  // ------------------------------------------------------------
  it('debería mantener el flujo completo de creación, lectura y eliminación', () => {
    setContext(sessionA, 'consulta');
    expect(getContext(sessionA)).toBe('consulta');

    clearContext(sessionA);
    expect(getContext(sessionA)).toBeUndefined();
  });
});
