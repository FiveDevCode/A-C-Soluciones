# 📢 Sistema de Notificaciones - Documentación Backend

## ✅ Implementación Completada

El sistema de notificaciones en tiempo real está **completamente funcional** en el backend.

---

## 🔧 Componentes Implementados

### 1. **Base de Datos**
- ✅ Tabla `notificaciones` creada en PostgreSQL
- ✅ Índices optimizados para consultas rápidas

### 2. **Modelo (Model)**
- ✅ `notificacion.model.js` con validaciones Sequelize

### 3. **Repositorio (Repository)**
- ✅ `notificacion.repository.js` con todas las consultas a BD

### 4. **Servicios (Services)**
- ✅ `notificacion.services.js` con lógica de negocio y Socket.io

### 5. **Controlador (Controller)**
- ✅ `notificacion.controller.js` con endpoints REST

### 6. **Rutas (Router)**
- ✅ `notificacion.routes.js` registrado en la aplicación

### 7. **WebSocket (Socket.io)**
- ✅ Configurado en `index.js` y `app.js`
- ✅ Emisión automática de notificaciones en tiempo real

### 8. **Integraciones**
- ✅ Notificaciones al crear solicitudes
- ✅ Notificaciones al actualizar estado de solicitudes
- ✅ Notificaciones al crear fichas de mantenimiento (cliente y técnico)

---

## 📡 Endpoints REST Disponibles

Todas las rutas requieren autenticación (`Authorization: Bearer <token>`):

### **Obtener todas las notificaciones**
```http
GET /api/notificaciones?limite=50
```
**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_notificacion": 1,
      "tipo_notificacion": "SERVICIO_SOLICITADO",
      "mensaje": "Tu solicitud del servicio 'Mantenimiento' ha sido registrada exitosamente.",
      "leida": false,
      "fecha_creacion": "2025-11-16T10:30:00Z",
      "id_referencia": 5,
      "tipo_referencia": "servicio"
    }
  ],
  "total": 1
}
```

### **Obtener solo notificaciones no leídas**
```http
GET /api/notificaciones/no-leidas
```

### **Contar notificaciones no leídas**
```http
GET /api/notificaciones/count
```
**Respuesta:**
```json
{
  "success": true,
  "data": { "cantidad": 3 }
}
```

### **Marcar una notificación como leída**
```http
PUT /api/notificaciones/:id_notificacion/leer
```

### **Marcar todas como leídas**
```http
PUT /api/notificaciones/leer-todas
```

### **Eliminar una notificación**
```http
DELETE /api/notificaciones/:id_notificacion
```

---

## 🔌 WebSocket - Socket.io (Para el equipo Frontend)

### **1. Instalación en Frontend**
```bash
npm install socket.io-client
```

### **2. Conexión al WebSocket**
```javascript
import io from 'socket.io-client';

// Conectar al servidor
const socket = io('http://localhost:3000', {
  withCredentials: true
});

// Evento de conexión exitosa
socket.on('connect', () => {
  console.log('✅ Conectado a WebSocket');
  
  // IMPORTANTE: Autenticarse después de conectar
  // El usuario debe estar autenticado y tener su id y rol
  socket.emit('autenticar_notificaciones', {
    id_usuario: user.id,        // ID del usuario autenticado
    tipo_usuario: user.rol      // 'cliente', 'administrador' o 'tecnico'
  });
});
```

### **3. Escuchar nuevas notificaciones en tiempo real**
```javascript
socket.on('nueva_notificacion', (notificacion) => {
  console.log('🔔 Nueva notificación:', notificacion);
  
  // Ejemplo de notificación recibida:
  // {
  //   id_notificacion: 10,
  //   tipo_notificacion: 'FICHA_CREADA',
  //   mensaje: 'Se ha creado una ficha de mantenimiento...',
  //   leida: false,
  //   fecha_creacion: '2025-11-16T10:30:00Z',
  //   id_referencia: 25,
  //   tipo_referencia: 'ficha_mantenimiento'
  // }
  
  // Aquí puedes:
  // - Mostrar un toast/notificación visual
  // - Actualizar el contador de notificaciones
  // - Reproducir un sonido
  // - Agregar a la lista de notificaciones en UI
});
```

### **4. Escuchar cuando una notificación es marcada como leída**
```javascript
socket.on('notificacion_leida', (data) => {
  console.log('✔️ Notificación leída:', data.id_notificacion);
  
  // Actualizar UI para reflejar que se leyó
});
```

### **5. Escuchar cuando todas las notificaciones son marcadas como leídas**
```javascript
socket.on('todas_notificaciones_leidas', () => {
  console.log('✔️ Todas las notificaciones marcadas como leídas');
  
  // Limpiar contador de notificaciones no leídas en UI
});
```

### **6. Manejo de desconexión**
```javascript
socket.on('disconnect', () => {
  console.log('❌ Desconectado de WebSocket');
});
```

### **7. Ejemplo completo en React**
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function NotificacionesComponent({ user }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [contador, setContador] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar Socket.io
    const newSocket = io('http://localhost:3000', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado');
      
      // Autenticarse
      newSocket.emit('autenticar_notificaciones', {
        id_usuario: user.id,
        tipo_usuario: user.rol
      });
    });

    // Escuchar nuevas notificaciones
    newSocket.on('nueva_notificacion', (notif) => {
      setNotificaciones(prev => [notif, ...prev]);
      setContador(prev => prev + 1);
      
      // Mostrar toast
      showToast(notif.mensaje);
    });

    setSocket(newSocket);

    // Cleanup al desmontar
    return () => newSocket.close();
  }, [user]);

  return (
    <div>
      <div>Notificaciones no leídas: {contador}</div>
      {/* Resto de tu UI */}
    </div>
  );
}
```

---

## 🎯 Tipos de Notificaciones Implementadas

| Tipo | Disparador | Destinatario |
|------|-----------|--------------|
| `SERVICIO_SOLICITADO` | Cliente solicita un servicio | Cliente |
| `CAMBIO_ESTADO_SOLICITUD` | Admin actualiza estado de solicitud | Cliente |
| `FICHA_CREADA` | Se crea una ficha de mantenimiento | Cliente |
| `FICHA_ASIGNADA` | Se crea una ficha de mantenimiento | Técnico |
| `NUEVA_SOLICITUD` | Cliente solicita un servicio | Administrador |

---

## 🧪 Pruebas

### **Probar notificaciones manualmente:**

1. Iniciar el servidor: `npm run dev`
2. Conectar frontend con Socket.io
3. Crear una solicitud o ficha desde Postman/Frontend
4. La notificación debería llegar automáticamente vía WebSocket

### **Verificar endpoints REST:**
```bash
# Obtener notificaciones (requiere token)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notificaciones

# Contar no leídas
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notificaciones/count
```

---

## 📝 Notas Importantes

1. **Autenticación WebSocket**: El cliente debe emitir `autenticar_notificaciones` después de conectarse
2. **Rooms**: Cada usuario tiene su propio "room" identificado por `usuario_{tipo}_{id}`
3. **Normalización de roles**: Los roles se normalizan a minúsculas (`cliente`, `administrador`, `tecnico`)
4. **Manejo de errores**: Las notificaciones usan `.catch()` para no bloquear la lógica principal
5. **CORS**: El origen del frontend debe estar en la lista permitida en `index.js`

---

## 🔐 Seguridad

- ✅ Todas las rutas REST requieren autenticación
- ✅ Un usuario solo puede ver/modificar sus propias notificaciones
- ✅ Los rooms de Socket.io son privados por usuario
- ✅ CORS configurado correctamente

---

## 📞 Soporte

Si el equipo de frontend tiene dudas sobre la implementación, pueden:
1. Revisar esta documentación
2. Probar los endpoints con Postman
3. Revisar los ejemplos de código en `services/notificacion.services.js`

---

**Estado**: ✅ **Completamente funcional y listo para integración con frontend**
