# Pruebas Unitarias del Módulo de Notificaciones

## Archivos de Prueba Creados

### 1. Controller Test
**Ubicación:** `test/unit/controllers/notificacion.controller.test.js`
- ✅ Pruebas para `obtenerNotificaciones` (con/sin límite)
- ✅ Pruebas para `obtenerNotificacionesNoLeidas`
- ✅ Pruebas para `contarNoLeidas`
- ✅ Pruebas para `marcarComoLeida` (éxito/404)
- ✅ Pruebas para `marcarTodasComoLeidas`
- ✅ Pruebas para `eliminarNotificacion` (éxito/404)
- ✅ Normalización de rol a minúsculas
- ✅ Casos de éxito y error para cada método

### 2. Service Test
**Ubicación:** `test/unit/services/notificacion.services.test.js`
- ✅ Inicialización de Socket.io
- ✅ Creación de notificaciones con emisión en tiempo real
- ✅ Obtención de notificaciones (todas/no leídas)
- ✅ Conteo de notificaciones no leídas
- ✅ Marcar como leída/s con emisión de eventos
- ✅ Eliminación de notificaciones
- ✅ **8 Métodos Helper**:
  - `notificarServicioSolicitado`
  - `notificarFichaCreada`
  - `notificarTecnicoFichaAsignada`
  - `notificarAdminNuevaSolicitud`
  - `notificarCambioEstadoSolicitud`
  - `notificarAdminVisitaCompletada`
  - `notificarTecnicoNuevaVisita`
  - `notificarNuevaFactura`

### 3. Repository Test
**Ubicación:** `test/unit/repository/notificacion.repository.test.js`
- ✅ Crear notificación
- ✅ Obtener por usuario (con límites)
- ✅ Obtener no leídas
- ✅ Contar no leídas
- ✅ Marcar como leída/s
- ✅ Obtener por ID
- ✅ Eliminar notificación
- ✅ Eliminar notificaciones antiguas
- ✅ Obtener por tipo de notificación
- ✅ Casos con resultados vacíos

### 4. Routes Test
**Ubicación:** `test/unit/routes/notificacion.routes.test.js`
- ✅ 3 rutas GET configuradas
- ✅ 2 rutas PUT configuradas
- ✅ 1 ruta DELETE configurada
- ✅ Middleware de autenticación (authenticate)
- ✅ Rutas correctamente definidas
- ✅ Controladores asociados correctamente

### 5. Model Test
**Ubicación:** `test/unit/models/notificacion.model.test.js`
- ✅ Configuración del modelo (tabla, timestamps)
- ✅ Primary key (id_notificacion)
- ✅ Validaciones de `id_destinatario` (isInt, min)
- ✅ Validaciones de `tipo_destinatario` (isIn)
- ✅ Validaciones de `tipo_notificacion` (notEmpty, len)
- ✅ Validaciones de `mensaje` (notEmpty, len max 1000)
- ✅ Validaciones de `id_referencia` (opcional, isInt, min)
- ✅ Validaciones de `tipo_referencia` (opcional, len)
- ✅ Campo `leida` (defaultValue: false)
- ✅ Campo `fecha_creacion` (defaultValue: NOW)
- ✅ **5 Índices de base de datos**

## Comandos para Ejecutar las Pruebas

### Ejecutar todas las pruebas de notificaciones
```bash
cd Backend
npm test -- --testPathPattern=notificacion
```

### Ejecutar con coverage completo
```bash
cd Backend
npm test -- --testPathPattern=notificacion --coverage --collectCoverageFrom="src/**/{notificacion.controller,notificacion.services,notificacion.repository,notificacion.model,notificacion.routes}.js"
```

### Ejecutar pruebas individuales
```bash
# Solo controller
npm test -- test/unit/controllers/notificacion.controller.test.js

# Solo service
npm test -- test/unit/services/notificacion.services.test.js

# Solo repository
npm test -- test/unit/repository/notificacion.repository.test.js

# Solo routes
npm test -- test/unit/routes/notificacion.routes.test.js

# Solo model
npm test -- test/unit/models/notificacion.model.test.js
```

## Cobertura Esperada

Estas pruebas están diseñadas para alcanzar **100% de cobertura** en:
- ✅ Statements (declaraciones)
- ✅ Branches (ramas/condiciones)
- ✅ Functions (funciones)
- ✅ Lines (líneas)

## Características de las Pruebas

### Uso de Mocks
- ✅ No toca la base de datos real
- ✅ Mockea el modelo Notificacion de Sequelize
- ✅ Mockea Socket.io para eventos en tiempo real
- ✅ Mockea dependencias entre capas
- ✅ Aislamiento completo de cada capa

### Casos Cubiertos
- ✅ Casos de éxito (200)
- ✅ Casos de error (404, 500)
- ✅ Validación de parámetros (límites, IDs)
- ✅ Normalización de roles
- ✅ Arrays vacíos
- ✅ Notificaciones no encontradas
- ✅ Socket.io no inicializado
- ✅ Operaciones con 0 filas afectadas

### Funcionalidades Especiales Testeadas
- ✅ **Socket.io en tiempo real**: Emisión de eventos cuando se crean/actualizan notificaciones
- ✅ **Rooms dinámicos**: `usuario_{tipo}_{id}` para cada usuario
- ✅ **Métodos helper**: 8 funciones de notificación automatizada
- ✅ **Índices de BD**: Verificación de 5 índices para optimización

## Estructura de Archivos

```
Backend/
├── src/
│   ├── controllers/
│   │   └── notificacion.controller.js ← Código fuente
│   ├── services/
│   │   └── notificacion.services.js ← Código fuente
│   ├── repository/
│   │   └── notificacion.repository.js ← Código fuente
│   ├── models/
│   │   └── notificacion.model.js ← Código fuente
│   └── routers/
│       └── notificacion.routes.js ← Código fuente
└── test/
    └── unit/
        ├── controllers/
        │   └── notificacion.controller.test.js ← ✅ NUEVO
        ├── services/
        │   └── notificacion.services.test.js ← ✅ NUEVO
        ├── repository/
        │   └── notificacion.repository.test.js ← ✅ NUEVO
        ├── models/
        │   └── notificacion.model.test.js ← ✅ NUEVO
        └── routes/
            └── notificacion.routes.test.js ← ✅ NUEVO
```

## Resumen de Pruebas

### Controller: 21 pruebas
- 6 métodos principales
- Múltiples casos por método (éxito/error/edge cases)
- Normalización de roles
- Validación de límites

### Service: 21 pruebas
- Socket.io inicialización y emisión
- 7 métodos principales de servicio
- 8 métodos helper de notificación
- Casos con/sin Socket.io

### Repository: 22 pruebas
- 9 métodos de acceso a datos
- Verificación de queries Sequelize
- Operadores Sequelize (Op.lt)
- Casos con resultados vacíos

### Routes: 13 pruebas
- 6 rutas configuradas (3 GET, 2 PUT, 1 DELETE)
- Verificación de middlewares
- Verificación de métodos HTTP
- Validación de estructura

### Model: 25 pruebas
- Configuración del modelo
- 8 campos con validaciones
- 5 índices de base de datos
- Valores por defecto
- Campos opcionales/requeridos

**TOTAL: ~102 pruebas unitarias**

## Casos de Uso Especiales

### 1. Notificaciones en Tiempo Real
```javascript
// El servicio emite eventos Socket.io cuando:
- Se crea una notificación → 'nueva_notificacion'
- Se marca como leída → 'notificacion_leida'
- Se marcan todas como leídas → 'todas_notificaciones_leidas'
```

### 2. Métodos Helper Automatizados
```javascript
// 8 funciones para notificar automáticamente:
- Servicio solicitado por cliente
- Ficha de mantenimiento creada
- Ficha asignada a técnico
- Nueva solicitud al admin
- Cambio de estado de solicitud
- Visita completada por técnico
- Nueva visita asignada a técnico
- Nueva factura registrada
```

### 3. Roles y Tipos de Destinatario
```javascript
// Tipos válidos: 'cliente', 'administrador', 'tecnico'
// El controller normaliza roles a minúsculas automáticamente
```

## Verificación de Coverage

Para ver el reporte detallado de coverage:

```bash
cd Backend
npm test -- --testPathPattern=notificacion --coverage
```

Esto generará un reporte en `Backend/coverage/lcov-report/index.html` que puedes abrir en el navegador.

## Notas Importantes

1. **Sin Dependencias de BD**: Todas las pruebas usan mocks, no requieren PostgreSQL
2. **Sin Socket.io real**: Mock completo de Socket.io para tiempo real
3. **Rápidas**: Se ejecutan en milisegundos
4. **Aisladas**: Cada prueba es independiente
5. **Mantenibles**: Fáciles de actualizar si cambia la lógica
6. **Completas**: Cubren todos los casos edge y errores

## Endpoints Testeados

```
GET    /api/notificaciones/count           - Contador de no leídas
GET    /api/notificaciones/no-leidas       - Solo no leídas
GET    /api/notificaciones                 - Todas (con ?limite=N)
PUT    /api/notificaciones/leer-todas      - Marcar todas leídas
PUT    /api/notificaciones/:id/leer        - Marcar una leída
DELETE /api/notificaciones/:id             - Eliminar una
```

## Validaciones del Modelo

| Campo | Validaciones |
|-------|-------------|
| `id_notificacion` | PK, autoIncrement, NOT NULL |
| `id_destinatario` | NOT NULL, isInt, min: 1 |
| `tipo_destinatario` | NOT NULL, isIn: ['cliente', 'administrador', 'tecnico'] |
| `tipo_notificacion` | NOT NULL, notEmpty, len: 3-50 |
| `mensaje` | NOT NULL, notEmpty, len: 1-1000 |
| `id_referencia` | OPTIONAL, isInt, min: 1 |
| `tipo_referencia` | OPTIONAL, len: 0-50 |
| `leida` | NOT NULL, default: false |
| `fecha_creacion` | NOT NULL, default: NOW |

¡Listo para ejecutar! 🚀
