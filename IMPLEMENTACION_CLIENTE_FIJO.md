# Implementación de Clientes Fijos

## ✅ Paso 1: Actualizar Base de Datos (COMPLETADO)

### SQL ejecutado:
```sql
ALTER TABLE "Clientes" 
ADD COLUMN tipo_cliente VARCHAR(10) DEFAULT 'regular' NOT NULL 
CHECK (tipo_cliente IN ('regular', 'fijo'));

COMMENT ON COLUMN "Clientes".tipo_cliente IS 'Tipo de cliente: regular (requiere visitas) o fijo (sin visitas)';
```

## ✅ Paso 2: Actualizar Modelo (COMPLETADO)

**Archivo:** `Backend/src/models/cliente.model.js`
- Campo `tipo_cliente` agregado con ENUM('regular', 'fijo')
- Valor por defecto: 'regular'

---

## 📋 Paso 3: Modificar Lógica de Fichas de Mantenimiento

### Archivo: `Backend/src/models/ficha_mantenimiento.model.js`

**Cambio necesario:** Hacer `visita_id_fk` opcional (allowNull: true)

**Validación en controller:**
- Si `tipo_cliente === 'regular'` → Requiere `visita_id_fk`
- Si `tipo_cliente === 'fijo'` → `visita_id_fk` es opcional/null

### Ejemplo de validación en controller:
```javascript
// En crearFichaMantenimiento
const cliente = await Cliente.findByPk(cliente_id);

if (!cliente) {
  return res.status(404).json({
    success: false,
    message: 'Cliente no encontrado'
  });
}

if (cliente.tipo_cliente === 'regular' && !visita_id_fk) {
  return res.status(400).json({
    success: false,
    message: 'Los clientes regulares requieren una visita asociada para crear una ficha'
  });
}

// Si es cliente fijo, puede o no tener visita_id_fk
```

---

## 📋 Paso 4: Modificar Lógica de Reportes de Bombeo

### Archivo: `Backend/src/models/reporte_bombeo.model.js`

**Cambio necesario:** Hacer `visita_id` opcional

**Validación similar:** Verificar tipo_cliente antes de requerir visita

---

## 📋 Paso 5: Modificar Lógica de Reportes de Mantenimiento

### Archivo: `Backend/src/models/reporte_mantenimiento.model.js`

**Cambio necesario:** Hacer campos relacionados a visita opcionales

---

## 📋 Paso 6: Frontend - Formulario de Crear Cliente

### Archivo: `Frontend/src/components/administrator/CreateClientAd.jsx` (o similar)

**Agregar campo:**
```jsx
<FormControl fullWidth>
  <InputLabel>Tipo de Cliente</InputLabel>
  <Select
    name="tipo_cliente"
    value={formData.tipo_cliente || 'regular'}
    onChange={handleChange}
  >
    <MenuItem value="regular">Regular (Con visitas)</MenuItem>
    <MenuItem value="fijo">Fijo (Sin visitas)</MenuItem>
  </Select>
  <FormHelperText>
    Clientes regulares necesitan solicitudes y visitas. 
    Clientes fijos reciben reportes directamente.
  </FormHelperText>
</FormControl>
```

---

## 📋 Paso 7: Frontend - Formularios de Reportes

### Modificar formularios para detectar tipo de cliente:

**Archivos a modificar:**
- `FormCreateReportAd.jsx` (Fichas de mantenimiento)
- Formulario de reportes de bombeo
- Formulario de reportes de mantenimiento

**Lógica condicional:**
```jsx
// Si tipo_cliente === 'fijo'
// → No mostrar campo de "Visita"
// → Mostrar selector directo de cliente

// Si tipo_cliente === 'regular'
// → Mostrar campo de "Visita" (comportamiento actual)
```

---

## 📋 Paso 8: Backend - Endpoints de Reportes

### Crear/modificar endpoints para clientes fijos:

**Nuevos endpoints sugeridos:**
```
POST /api/fichas/cliente-fijo
POST /api/reportes-bombeo/cliente-fijo
POST /api/reportes-mantenimiento/cliente-fijo
```

**O modificar endpoints existentes para aceptar:**
```javascript
{
  "cliente_id": 123,
  "tipo_cliente": "fijo", // Opcional, se puede obtener de la BD
  "visita_id": null, // Null para clientes fijos
  // ... resto de datos
}
```

---

## 🎯 Resumen de Cambios por Tipo

### CLIENTES REGULARES (actual):
1. Cliente crea solicitud
2. Admin programa visita
3. Técnico ejecuta visita
4. Se crea ficha/reporte asociado a visita

### CLIENTES FIJOS (nuevo):
1. Admin selecciona cliente fijo
2. Admin llena formulario de reporte directamente
3. Sistema envía reporte por correo
4. **No requiere:** solicitud ni visita

---

## ✅ Verificaciones Finales

- [ ] SQL ejecutado en PostgreSQL
- [x] Modelo Cliente actualizado
- [ ] Modelo Ficha actualizado (visita_id_fk opcional)
- [ ] Modelo Reporte Bombeo actualizado
- [ ] Modelo Reporte Mantenimiento actualizado
- [ ] Controller de fichas con validación de tipo_cliente
- [ ] Formulario de crear cliente con campo tipo_cliente
- [ ] Formularios de reportes adaptados para clientes fijos
- [ ] Endpoints funcionando para ambos tipos
- [ ] Envío de correos funcionando para clientes fijos

---

## 📧 Flujo de Correo

**Para clientes fijos:**
- El sistema debe enviar automáticamente el PDF por correo
- No depende de completar visita
- Se envía inmediatamente al crear el reporte

**Para clientes regulares:**
- Mantiene flujo actual (envío al completar visita)
