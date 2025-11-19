/**
 * ARCHIVO DE PRUEBA PARA NOTIFICACIONES
 * 
 * Este archivo contiene ejemplos de cómo se disparan las notificaciones
 * desde diferentes partes del sistema.
 */

// ============================================
// 1. NOTIFICACIÓN AL CREAR SOLICITUD DE SERVICIO
// ============================================
// Se dispara en: solicitud.controller.js -> crear()
// 
// Flujo:
// 1. Cliente crea una solicitud de servicio
// 2. Se guarda en BD
// 3. Se envía notificación al cliente confirmando la solicitud
// 4. La notificación llega en tiempo real vía WebSocket
//
// Ejemplo de notificación generada:
// {
//   id_destinatario: 5,
//   tipo_destinatario: 'cliente',
//   tipo_notificacion: 'SERVICIO_SOLICITADO',
//   mensaje: 'Tu solicitud del servicio "Mantenimiento preventivo" ha sido registrada exitosamente.',
//   id_referencia: 10,
//   tipo_referencia: 'servicio',
//   leida: false
// }


// ============================================
// 2. NOTIFICACIÓN AL CAMBIAR ESTADO DE SOLICITUD
// ============================================
// Se dispara en: solicitud.controller.js -> actualizarEstado()
//
// Flujo:
// 1. Administrador actualiza el estado de una solicitud
// 2. Se guarda el nuevo estado en BD
// 3. Se envía notificación al cliente informando el cambio
// 4. La notificación llega en tiempo real vía WebSocket
//
// Ejemplo de notificación generada:
// {
//   id_destinatario: 5,
//   tipo_destinatario: 'cliente',
//   tipo_notificacion: 'CAMBIO_ESTADO_SOLICITUD',
//   mensaje: 'El estado de tu solicitud ha cambiado a: Aprobada.',
//   id_referencia: 10,
//   tipo_referencia: 'solicitud',
//   leida: false
// }


// ============================================
// 3. NOTIFICACIÓN AL CREAR FICHA DE MANTENIMIENTO
// ============================================
// Se dispara en: ficha_mantenimiento.controller.js -> crearFichaMantenimiento()
//
// Flujo:
// 1. Se crea una ficha de mantenimiento
// 2. Se genera el PDF
// 3. Se envían DOS notificaciones:
//    a) Al CLIENTE: informando que se creó su ficha
//    b) Al TÉCNICO: informando que se le asignó una ficha
// 4. Ambas notificaciones llegan en tiempo real vía WebSocket
//
// Ejemplo de notificación al CLIENTE:
// {
//   id_destinatario: 5,
//   tipo_destinatario: 'cliente',
//   tipo_notificacion: 'FICHA_CREADA',
//   mensaje: 'Se ha creado una ficha de mantenimiento para tu equipo. Técnico asignado: Juan Pérez.',
//   id_referencia: 15,
//   tipo_referencia: 'ficha_mantenimiento',
//   leida: false
// }
//
// Ejemplo de notificación al TÉCNICO:
// {
//   id_destinatario: 8,
//   tipo_destinatario: 'tecnico',
//   tipo_notificacion: 'FICHA_ASIGNADA',
//   mensaje: 'Se te ha asignado una nueva ficha de mantenimiento para el cliente: María López.',
//   id_referencia: 15,
//   tipo_referencia: 'ficha_mantenimiento',
//   leida: false
// }


// ============================================
// CÓMO AGREGAR MÁS NOTIFICACIONES
// ============================================
//
// 1. Ve a services/notificacion.services.js
// 2. Crea una función helper, ejemplo:
//
//    export const notificarNuevoMensaje = async (id_usuario, tipo_usuario, mensaje) => {
//      return await crearNotificacion({
//        id_destinatario: id_usuario,
//        tipo_destinatario: tipo_usuario,
//        tipo_notificacion: 'NUEVO_MENSAJE',
//        mensaje: mensaje,
//        id_referencia: null,
//        tipo_referencia: null
//      });
//    };
//
// 3. Importa y usa esa función en el controller donde lo necesites:
//
//    import * as notificacionService from '../services/notificacion.services.js';
//    
//    // Dentro de tu método del controller:
//    await notificacionService.notificarNuevoMensaje(
//      clienteId,
//      'cliente',
//      'Tienes un nuevo mensaje del administrador'
//    );
//
// 4. ¡Listo! La notificación se enviará automáticamente vía WebSocket


// ============================================
// PRUEBAS MANUALES CON POSTMAN
// ============================================
//
// 1. Crear una solicitud (POST /api/solicitudes):
// {
//   "cliente_id_fk": 1,
//   "servicio_id_fk": 2,
//   "descripcion": "Necesito mantenimiento"
// }
// → Debería crear una notificación para el cliente con id=1
//
// 2. Consultar notificaciones (GET /api/notificaciones):
// Headers: Authorization: Bearer <token>
// → Debería devolver todas las notificaciones del usuario autenticado
//
// 3. Contar no leídas (GET /api/notificaciones/count):
// Headers: Authorization: Bearer <token>
// → Debería devolver el número de notificaciones no leídas


// ============================================
// WEBSOCKET - PRUEBA CON HERRAMIENTA
// ============================================
//
// Puedes probar el WebSocket con herramientas como:
// - Postman (tiene soporte para WebSocket)
// - Socket.io Client Tool (extensión de navegador)
// - O crear un HTML simple:
//
// <!DOCTYPE html>
// <html>
// <head>
//   <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
// </head>
// <body>
//   <h1>Test WebSocket Notificaciones</h1>
//   <div id="notificaciones"></div>
//   
//   <script>
//     const socket = io('http://localhost:3000');
//     
//     socket.on('connect', () => {
//       console.log('Conectado!');
//       
//       // Autenticarse (cambiar ID y tipo según tu usuario)
//       socket.emit('autenticar_notificaciones', {
//         id_usuario: 1,
//         tipo_usuario: 'cliente'
//       });
//     });
//     
//     socket.on('nueva_notificacion', (notif) => {
//       console.log('Nueva notificación:', notif);
//       document.getElementById('notificaciones').innerHTML += 
//         `<p>${notif.mensaje}</p>`;
//     });
//   </script>
// </body>
// </html>

export default {};
