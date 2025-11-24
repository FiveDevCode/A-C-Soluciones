# API de Reportes de Mantenimiento de Plantas Eléctricas

## Descripción
Esta API permite crear, listar y descargar reportes de mantenimiento de plantas eléctricas en formato PDF, siguiendo la misma lógica que las fichas de mantenimiento.

## Estructura de Base de Datos

### Tabla: reportemantenimientoplantaselectricas
- id (PK)
- fecha
- id_cliente (FK)
- id_tecnico (FK)
- id_administrador (FK, opcional)
- direccion
- ciudad
- telefono
- encargado
- marca_generador
- modelo_generador
- kva
- serie_generador
- observaciones_finales
- pdf_path
- created_at
- updated_at

### Tabla: parametrosoperacion
- id (PK)
- reporte_id (FK)
- presion_aceite
- temperatura_aceite
- temperatura_refrigerante
- fugas_aceite (boolean)
- fugas_combustible (boolean)
- frecuencia_rpm
- voltaje_salida

### Tabla: verificacionmantenimiento
- id (PK)
- reporte_id (FK)
- item
- visto (boolean)
- observacion

## Endpoints

### 1. Crear Reporte de Mantenimiento
**POST** `/api/reportes-mantenimiento`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** administrador, tecnico

**Body (JSON):**
```json
{
  "fecha": "2025-11-10",
  "id_cliente": 1,
  "id_tecnico": 1,
  "id_administrador": 1,
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá",
  "telefono": "3001234567",
  "encargado": "Juan Pérez",
  "marca_generador": "Caterpillar",
  "modelo_generador": "C15",
  "kva": "500",
  "serie_generador": "ABC123456",
  "observaciones_finales": "Equipo en buen estado general. Se recomienda cambio de aceite en 100 horas.",
  "parametros_operacion": [
    {
      "presion_aceite": "45 PSI",
      "temperatura_aceite": "85°C",
      "temperatura_refrigerante": "75°C",
      "fugas_aceite": false,
      "fugas_combustible": false,
      "frecuencia_rpm": "60 Hz / 1800 RPM",
      "voltaje_salida": "220V"
    }
  ],
  "verificaciones": [
    {
      "item": "Nivel de aceite del motor",
      "visto": true,
      "observacion": "Nivel correcto"
    },
    {
      "item": "Nivel de refrigerante",
      "visto": true,
      "observacion": "Nivel correcto"
    },
    {
      "item": "Filtros de aire",
      "visto": true,
      "observacion": "Limpio, sin obstrucciones"
    },
    {
      "item": "Correas de alternador",
      "visto": true,
      "observacion": "En buen estado, tensión correcta"
    },
    {
      "item": "Batería y terminales",
      "visto": true,
      "observacion": "Carga correcta, terminales limpios"
    },
    {
      "item": "Sistema de escape",
      "visto": true,
      "observacion": "Sin fugas"
    },
    {
      "item": "Panel de control",
      "visto": true,
      "observacion": "Funcionando correctamente"
    },
    {
      "item": "Conexiones eléctricas",
      "visto": true,
      "observacion": "Ajustadas y sin corrosión"
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "mensaje": "Reporte de mantenimiento creado correctamente y enviado al cliente.",
  "reporte": {
    "id": 1,
    "fecha": "2025-11-10T00:00:00.000Z",
    "cliente": "Empresa XYZ S.A.S",
    "tecnico": "Carlos Rodríguez",
    "pdf_path": "uploads/reportes/reporte_mantenimiento_abc123def456.pdf",
    "parametros": 1,
    "verificaciones": 8
  }
}
```

### 2. Listar Reportes
**GET** `/api/reportes-mantenimiento`

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** administrador, tecnico, cliente

**Respuesta Exitosa (200):**
```json
{
  "mensaje": "Reportes obtenidos correctamente",
  "total": 2,
  "reportes": [
    {
      "id": 1,
      "fecha": "2025-11-10T00:00:00.000Z",
      "id_cliente": 1,
      "id_tecnico": 1,
      "direccion": "Calle 123 #45-67",
      "ciudad": "Bogotá",
      "marca_generador": "Caterpillar",
      "modelo_generador": "C15",
      "parametros": [...],
      "verificaciones": [...]
    }
  ]
}
```

**Nota:** 
- Los administradores ven todos los reportes
- Los técnicos solo ven sus propios reportes
- Los clientes solo ven sus propios reportes

### 3. Obtener Reporte por ID
**GET** `/api/reportes-mantenimiento/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** administrador, tecnico, cliente (solo su propio reporte)

**Respuesta Exitosa (200):**
```json
{
  "mensaje": "Reporte obtenido correctamente",
  "reporte": {
    "id": 1,
    "fecha": "2025-11-10T00:00:00.000Z",
    "id_cliente": 1,
    "id_tecnico": 1,
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "marca_generador": "Caterpillar",
    "modelo_generador": "C15",
    "parametros": [...],
    "verificaciones": [...]
  }
}
```

### 4. Descargar PDF
**GET** `/api/reportes-mantenimiento/:id/pdf`

**Headers:**
```
Authorization: Bearer <token>
```

**Permisos:** administrador, tecnico, cliente (solo su propio reporte)

**Respuesta:** Descarga el archivo PDF del reporte

## Características Principales

1. **Generación Automática de PDF**: Al crear un reporte, se genera automáticamente un PDF con diseño profesional.

2. **Envío por Email**: El PDF se envía automáticamente al correo del cliente.

3. **Almacenamiento**: Los PDFs se guardan en la carpeta `uploads/reportes/`

4. **Parámetros de Operación**: Se pueden registrar múltiples parámetros de operación del generador.

5. **Verificaciones**: Lista de ítems verificados durante el mantenimiento con observaciones.

6. **Control de Acceso**: Validación de permisos según el rol del usuario.

## Ejemplo de Items de Verificación Comunes

```javascript
const verificacionesTipo = [
  "Nivel de aceite del motor",
  "Nivel de refrigerante",
  "Filtros de aire",
  "Filtros de combustible",
  "Filtros de aceite",
  "Correas de alternador",
  "Batería y terminales",
  "Sistema de escape",
  "Panel de control",
  "Conexiones eléctricas",
  "Tubería de combustible",
  "Radiador",
  "Ventilador",
  "Bomba de agua",
  "Alternador",
  "Motor de arranque",
  "Fugas de líquidos",
  "Ruidos anormales",
  "Vibraciones excesivas",
  "Sistema de transferencia automática"
];
```

## Archivos Creados

1. **Modelo**: `/src/models/reporte_mantenimiento.model.js`
2. **Repositorio**: `/src/repository/reporte_mantenimiento.repository.js`
3. **Servicio**: `/src/services/reporte_mantenimiento.services.js`
4. **Controlador**: `/src/controllers/reporte_mantenimiento.controller.js`
5. **Router**: `/src/routers/reporte_mantenimiento.router.js`

## Configuración Adicional

El router ya está registrado en `app.js` con las siguientes rutas:
- API: `/api/reportes-mantenimiento`
- Archivos estáticos: `/reportes` (para acceso directo a PDFs)

## Pruebas

Para probar la API, puedes usar Postman o cURL:

```bash
# Crear un reporte
curl -X POST http://localhost:8000/api/reportes-mantenimiento \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @reporte_ejemplo.json

# Listar reportes
curl -X GET http://localhost:8000/api/reportes-mantenimiento \
  -H "Authorization: Bearer YOUR_TOKEN"

# Descargar PDF
curl -X GET http://localhost:8000/api/reportes-mantenimiento/1/pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o reporte.pdf
```
