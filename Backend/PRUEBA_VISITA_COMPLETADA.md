# 🧪 Prueba de Notificación: Técnico Finaliza Visita

## Escenario
Cuando un técnico marca una visita como "completada", se debe enviar una notificación a todos los administradores.

---

## 📋 JSON para Thunder Client

### **Actualizar Estado de Visita a "Completada"**

**Endpoint:** `PUT http://localhost:3000/api/visitas/:id`  
**Headers:** `Authorization: Bearer <token_del_tecnico>`

**Body (JSON):**
```json
{
  "estado": "completada"
}
```

**Ejemplo completo:**
```json
{
  "estado": "completada",
  "notas_finales": "Servicio completado exitosamente. Equipo funcionando correctamente."
}
```

---

## ✅ Resultado Esperado

### 1. **Respuesta del Endpoint**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "fecha_programada": "2025-11-19T10:00:00.000Z",
    "estado": "completada",
    "notas_finales": "Servicio completado exitosamente...",
    "tecnico_id_fk": 2,
    "solicitud_id_fk": 3,
    // ... resto de campos
  }
}
```

### 2. **Notificación Creada en BD**
Se crea una notificación para cada administrador:

```sql
SELECT * FROM notificaciones WHERE tipo_notificacion = 'VISITA_COMPLETADA';
```

Ejemplo de registro:
```
id_notificacion: 15
id_destinatario: 1
tipo_destinatario: 'administrador'
tipo_notificacion: 'VISITA_COMPLETADA'
mensaje: 'El técnico Juan Pérez ha finalizado la visita con el cliente María López.'
id_referencia: 5
tipo_referencia: 'visita'
leida: false
fecha_creacion: 2025-11-19 15:30:00
```

### 3. **Emisión WebSocket en Tiempo Real**
Si el administrador está conectado vía WebSocket, recibirá:

```javascript
socket.on('nueva_notificacion', (notificacion) => {
  console.log(notificacion);
  // {
  //   id_notificacion: 15,
  //   tipo_notificacion: 'VISITA_COMPLETADA',
  //   mensaje: 'El técnico Juan Pérez ha finalizado la visita con el cliente María López.',
  //   leida: false,
  //   fecha_creacion: '2025-11-19T15:30:00.000Z',
  //   id_referencia: 5,
  //   tipo_referencia: 'visita'
  // }
});
```

---

## 🔍 Cómo Verificar la Notificación

### **Opción 1: Consultar como Administrador**

**Endpoint:** `GET http://localhost:3000/api/notificaciones`  
**Headers:** `Authorization: Bearer <token_del_admin>`

Deberías ver la notificación de tipo `VISITA_COMPLETADA`.

---

### **Opción 2: Contar Notificaciones No Leídas**

**Endpoint:** `GET http://localhost:3000/api/notificaciones/count`  
**Headers:** `Authorization: Bearer <token_del_admin>`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cantidad": 1
  }
}
```

---

## 📝 Flujo Completo de Prueba

### **Paso 1: Crear una Visita (como Admin)**
```http
POST /api/visitas
Authorization: Bearer <token_admin>

{
  "solicitud_id_fk": 3,
  "tecnico_id_fk": 2,
  "servicio_id_fk": 1,
  "fecha_programada": "2025-11-20T10:00:00Z",
  "duracion_estimada": 120,
  "notas_previas": "Revisar bomba de agua"
}
```

### **Paso 2: Actualizar Estado a "Completada" (como Técnico)**
```http
PUT /api/visitas/5
Authorization: Bearer <token_tecnico>

{
  "estado": "completada",
  "notas_finales": "Mantenimiento completado"
}
```

### **Paso 3: Verificar Notificación (como Admin)**
```http
GET /api/notificaciones
Authorization: Bearer <token_admin>
```

---

## 🎯 Estados de Visita Disponibles

- `programada` - Visita agendada
- `en_camino` - Técnico en camino
- `iniciada` - Técnico comenzó el trabajo
- `completada` - ✅ **Dispara notificación al admin**
- `cancelada` - Visita cancelada

**Nota:** Solo el estado `completada` dispara la notificación al administrador.

---

## ⚙️ Lógica Implementada

1. **Técnico actualiza visita** → Estado = "completada"
2. **Sistema obtiene información**:
   - Nombre del técnico
   - Nombre del cliente (desde solicitud)
   - ID de la visita
3. **Sistema busca todos los administradores**
4. **Sistema crea notificación para cada admin**
5. **Sistema emite evento WebSocket** a cada admin conectado
6. **Admin recibe notificación en tiempo real**

---

## 🔐 Permisos

- ✅ **Técnico**: Puede actualizar estado de visita a "completada"
- ✅ **Administrador**: Puede actualizar estado de visita
- ❌ **Cliente**: No puede actualizar visitas

---

## 🐛 Troubleshooting

### La notificación no se crea
- Verificar que el técnico tenga nombre y apellido en BD
- Verificar que la visita tenga solicitud asociada
- Verificar que existan administradores en la BD
- Revisar logs del servidor para errores

### La notificación no llega en tiempo real
- Verificar que el admin esté conectado al WebSocket
- Verificar que el admin haya emitido `autenticar_notificaciones`
- Verificar que el room sea correcto: `usuario_administrador_{id}`

---

**Implementado y listo para probar!** ✅
