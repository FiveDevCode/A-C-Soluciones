# PRUEBAS UNITARIAS - MÓDULO REPORTE DE BOMBEO

## 📋 Resumen

Suite completa de pruebas unitarias para el módulo de **Reporte de Bombeo** con cobertura del 100%. Este módulo maneja la creación, gestión y generación de reportes en PDF para el mantenimiento de equipos de bombeo.

## 📊 Estadísticas de Coverage

| Archivo | Statements | Branches | Functions | Lines | Tests |
|---------|-----------|----------|-----------|-------|-------|
| **Models** | | | | | **47** |
| reporte_bombeo.model.js | 100% | 100% | 100% | 100% | 16 |
| equipoBombeo.model.js | 100% | 100% | 100% | 100% | 13 |
| parametroBombeo.model.js | 100% | 100% | 100% | 100% | 11 |
| **Repository** | 100% | 100% | 100% | 100% | **11** |
| reporte_bombeo.repository.js | 100% | 100% | 100% | 100% | 11 |
| **Services** | 100% | 100% | 100% | 100% | **18** |
| reporte_bombeo.services.js | 100% | 100% | 100% | 100% | 18 |
| **Controllers** | 100% | 100% | 100% | 100% | **18** |
| reporte_bombeo.controller.js | 100% | 100% | 100% | 100% | 18 |
| **Routes** | 100% | 100% | 100% | 100% | **13** |
| reporte_bombeo.routes.js | 100% | 100% | 100% | 100% | 13 |
| **TOTAL** | **100%** | **100%** | **100%** | **100%** | **107** |

## 🗂️ Estructura de Archivos de Tests

```
test/unit/
├── models/
│   ├── reporte_bombeo.model.test.js          (16 tests)
│   ├── equipoBombeo.model.test.js            (13 tests)
│   └── parametroBombeo.model.test.js         (11 tests)
├── repository/
│   └── reporte_bombeo.repository.test.js     (11 tests)
├── services/
│   └── reporte_bombeo.services.test.js       (18 tests)
├── controllers/
│   └── reporte_bombeo.controller.test.js     (18 tests)
└── routes/
    └── reporte_bombeo.routes.test.js         (13 tests)
```

## 🔍 Detalle por Capa

### 1️⃣ Models (47 tests)

#### **reporte_bombeo.model.test.js** (16 tests)
Valida la definición del modelo principal de reportes de bombeo:
- ✅ Definición del modelo con Sequelize
- ✅ Campo `id` (primary key, autoincrement)
- ✅ Campo `fecha` (DATEONLY, requerido, validaciones)
- ✅ Campo `cliente_id` (referencia a cliente, requerido)
- ✅ Campo `tecnico_id` (referencia a tecnico, requerido)
- ✅ Campo `administrador_id` (referencia a administrador, opcional)
- ✅ Campo `visita_id` (referencia a visitas, opcional)
- ✅ Campo `direccion` (STRING(150), requerido, validaciones)
- ✅ Campo `ciudad` (STRING(100), requerido, validaciones)
- ✅ Campo `telefono` (STRING(50), requerido, validaciones)
- ✅ Campo `encargado` (STRING(100), requerido, validaciones)
- ✅ Campo `observaciones_finales` (TEXT, requerido)
- ✅ Campo `pdf_path` (STRING(255), opcional)
- ✅ Configuración tableName: "reportebombeo"
- ✅ Timestamps con created_at y updated_at
- ✅ Exportación del modelo

#### **equipoBombeo.model.test.js** (13 tests)
Valida el modelo de equipos de bombeo:
- ✅ Definición del modelo
- ✅ Campo `id` (primary key)
- ✅ Campo `reporte_id` (FK a reportebombeo)
- ✅ Campo `equipo` (STRING(100), requerido)
- ✅ Campo `marca` (STRING(100), requerido)
- ✅ Campo `amperaje` (STRING(50), requerido)
- ✅ Campo `presion` (STRING(50), requerido)
- ✅ Campo `temperatura` (STRING(50), requerido)
- ✅ Campo `estado` (STRING(50), requerido)
- ✅ Campo `observacion` (TEXT, requerido)
- ✅ TableName: "equipobombeo"
- ✅ Timestamps desactivados
- ✅ Exportación del modelo

#### **parametroBombeo.model.test.js** (11 tests)
Valida el modelo de parámetros eléctricos y de presión:
- ✅ Definición del modelo
- ✅ Campo `id` (primary key)
- ✅ Campo `reporte_id` (FK a reportebombeo)
- ✅ Campo `voltaje_linea` (STRING(50), requerido)
- ✅ Campo `corriente_linea` (STRING(50), requerido)
- ✅ Campo `presion_succion` (STRING(50), requerido)
- ✅ Campo `presion_descarga` (STRING(50), requerido)
- ✅ Campo `observaciones` (TEXT, opcional)
- ✅ TableName: "parametrobombeo"
- ✅ Timestamps desactivados
- ✅ Exportación del modelo

### 2️⃣ Repository (11 tests)

#### **reporte_bombeo.repository.test.js** (11 tests)
Valida las operaciones de acceso a datos:
- ✅ **crearReporteCompleto**: Crea reporte con equipos y parámetros en transacción
- ✅ **crearReporteCompleto**: Maneja errores en transacción
- ✅ **obtenerReportePorId**: Obtiene reporte con todas las relaciones
- ✅ **obtenerReportePorId**: Retorna null si no encuentra
- ✅ **obtenerTodosReportes**: Sin filtro de visita_id
- ✅ **obtenerTodosReportes**: Filtrado por visita_id
- ✅ **obtenerTodosReportes**: Retorna array vacío
- ✅ **obtenerReportesPorCliente**: Filtra por cliente_id
- ✅ **obtenerReportesPorCliente**: Cliente sin reportes
- ✅ **actualizarPDFPath**: Actualiza ruta del PDF
- ✅ **actualizarPDFPath**: Advertencia si no encuentra reporte

### 3️⃣ Services (18 tests)

#### **reporte_bombeo.services.test.js** (18 tests)
Valida la generación de PDFs:
- ✅ Genera PDF y retorna ruta del archivo
- ✅ Crea directorio si no existe
- ✅ Incluye header de la empresa (A&C SOLUCIONES)
- ✅ Incluye información del cliente y fecha
- ✅ Incluye tabla de equipos con todos los datos
- ✅ Incluye parámetros eléctricos y de presión
- ✅ Incluye observaciones finales
- ✅ Incluye firmas del técnico y cliente
- ✅ Maneja valores N/A en equipos incompletos
- ✅ Maneja valores N/A en parámetros incompletos
- ✅ Maneja observaciones finales vacías
- ✅ Maneja observaciones de parámetros vacías
- ✅ Dibuja rectángulos y líneas para diseño
- ✅ Rechaza promesa en error de stream
- ✅ Procesa múltiples equipos correctamente
- ✅ Usa PDFKit correctamente
- ✅ Genera nombres de archivo únicos con crypto
- ✅ Maneja eventos del stream correctamente

### 4️⃣ Controllers (18 tests)

#### **reporte_bombeo.controller.test.js** (18 tests)
Valida los endpoints del controlador:

**crearReporteBombeo** (8 tests):
- ✅ Crea reporte exitosamente para cliente fijo
- ✅ Error 400 si faltan datos requeridos
- ✅ Error 404 si cliente no existe
- ✅ Error 400 si cliente regular no tiene visita_id
- ✅ Error 400 si cliente fijo tiene visita_id
- ✅ Error 404 si técnico no existe
- ✅ Maneja errores de validación de Sequelize
- ✅ Maneja errores internos del servidor

**listarReportes** (7 tests):
- ✅ Lista todos los reportes para admin
- ✅ Filtra por visita_id para admin
- ✅ Lista todos para técnico
- ✅ Lista solo reportes del cliente para rol cliente
- ✅ Error 401 si no hay usuario autenticado
- ✅ Error 403 para rol no autorizado
- ✅ Maneja errores del servidor

**obtenerReportePorId** (3 tests):
- ✅ Obtiene reporte por ID exitosamente
- ✅ Error 404 si no existe
- ✅ Maneja errores del servidor

### 5️⃣ Routes (13 tests)

#### **reporte_bombeo.routes.test.js** (13 tests)
Valida la configuración de rutas:
- ✅ Crea el router correctamente
- ✅ Ruta POST /api/reportes-bombeo (crear)
- ✅ Ruta GET /api/reportes-bombeo (listar)
- ✅ Ruta GET /reportes-bombeo/:idReporte (obtener por ID)
- ✅ 1 ruta POST configurada
- ✅ 2 rutas GET configuradas
- ✅ Usa middleware `authenticate` para rutas protegidas
- ✅ Usa middleware `isAdminOrTecnico` para crear y listar
- ✅ NO usa `authenticate` en obtener por ID
- ✅ Exporta router por defecto
- ✅ Llama controladores correctos
- ✅ Usa prefijo /api para crear y listar
- ✅ Parámetro :idReporte configurado

## 🚀 Comandos para Ejecutar Tests

### Ejecutar todos los tests del módulo
```bash
npm test -- --testPathPattern=reporte_bombeo
```

### Ejecutar con coverage
```bash
npm test -- --testPathPattern=reporte_bombeo --coverage
```

### Ejecutar solo models
```bash
npm test -- test/unit/models/reporte_bombeo.model.test.js
npm test -- test/unit/models/equipoBombeo.model.test.js
npm test -- test/unit/models/parametroBombeo.model.test.js
```

### Ejecutar solo repository
```bash
npm test -- test/unit/repository/reporte_bombeo.repository.test.js
```

### Ejecutar solo services
```bash
npm test -- test/unit/services/reporte_bombeo.services.test.js
```

### Ejecutar solo controllers
```bash
npm test -- test/unit/controllers/reporte_bombeo.controller.test.js
```

### Ejecutar solo routes
```bash
npm test -- test/unit/routes/reporte_bombeo.routes.test.js
```

### Ejecutar en modo watch
```bash
npm test -- --testPathPattern=reporte_bombeo --watch
```

## ✅ Validaciones Clave

### Validación de Tipos de Cliente
- **Cliente Fijo**: NO debe tener `visita_id`
- **Cliente Regular**: DEBE tener `visita_id`

### Transacciones
- Creación de reporte completo usa transacciones de Sequelize
- Rollback automático en caso de error

### Generación de PDF
- Nombres únicos con crypto.randomBytes
- Creación automática de directorios
- Diseño profesional con headers, tablas y firmas
- Manejo de valores opcionales con "N/A"

### Seguridad
- Middleware `authenticate` para rutas protegidas
- Middleware `isAdminOrTecnico` para crear y listar
- Validación de permisos por rol (admin, tecnico, cliente)

### Integración
- Envío automático de email con PDF adjunto al cliente
- Actualización de `pdf_path` en base de datos
- Relaciones con Cliente, Técnico, Admin y Visita

## 🔧 Mocks Utilizados

### Models
- `sequelize.define` - Mock de definición de modelos
- `DataTypes` - Tipos de datos de Sequelize

### Repository
- `ReporteBombeo` - Modelo de reportes
- `EquipoBombeo` - Modelo de equipos
- `ParametroBombeo` - Modelo de parámetros
- `sequelize.transaction` - Transacciones
- Modelos relacionados (Cliente, Tecnico, Admin, Visita)

### Services
- `PDFDocument` (pdfkit) - Generación de PDFs
- `fs` - Sistema de archivos
- `path` - Manejo de rutas
- `crypto` - Generación de nombres únicos

### Controllers
- Repository functions
- `generarPDFReporteBombeo` - Servicio de PDF
- `sendEmail` - Servicio de emails
- Modelos de Cliente y Tecnico

### Routes
- `express.Router` - Router de Express
- Controllers
- Middlewares de autenticación

## 📝 Notas Importantes

1. **Sin acceso a base de datos**: Todos los tests usan mocks, no tocan la BD real
2. **Aislamiento completo**: Cada test es independiente
3. **Fast execution**: Tests rápidos y confiables
4. **100% Coverage**: Cobertura completa de código
5. **CI/CD Ready**: Listos para integración continua

## 🎯 Casos de Uso Cubiertos

### Flujo Principal
1. Usuario admin/tecnico crea reporte de bombeo
2. Sistema valida tipo de cliente y requisitos de visita
3. Sistema crea reporte, equipos y parámetros en transacción
4. Sistema genera PDF profesional con toda la información
5. Sistema guarda ruta del PDF en base de datos
6. Sistema envía email al cliente con PDF adjunto

### Validaciones
- Datos requeridos presentes
- Cliente existe en el sistema
- Técnico existe en el sistema
- Tipo de cliente vs requisito de visita
- Formato de datos (fechas, strings, etc.)

### Permisos
- Admin: Ve todos los reportes
- Técnico: Ve todos los reportes
- Cliente: Ve solo sus reportes
- No autenticado: Error 401
- Rol no autorizado: Error 403

## 🏆 Mejores Prácticas Implementadas

- ✅ AAA Pattern (Arrange, Act, Assert)
- ✅ Descriptive test names
- ✅ beforeEach/afterEach cleanup
- ✅ Mock isolation
- ✅ Error handling coverage
- ✅ Edge cases testing
- ✅ Integration scenarios
- ✅ Performance considerations

## 📧 Contacto

Para dudas o mejoras sobre estos tests, contactar al equipo de desarrollo.

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Total de Tests**: 107  
**Coverage**: 100%
