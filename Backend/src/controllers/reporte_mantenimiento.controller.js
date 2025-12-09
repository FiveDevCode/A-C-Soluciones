import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { generarPDFReporte } from '../services/reporte_mantenimiento.services.js';
import { sendEmail } from '../services/email.services.js';
import { uploadPDFToCloudinary } from '../services/cloudinary.services.js';
import * as reporteRepo from '../repository/reporte_mantenimiento.repository.js';
import { ValidationError } from 'sequelize';

export const crearReporteMantenimiento = async (req, res) => {
  try {
    console.log('🆕 [CREAR REPORTE] req.body:', req.body);

    const {
      fecha,
      id_cliente,
      id_tecnico,
      id_administrador,
      direccion,
      ciudad,
      telefono,
      encargado,
      marca_generador,
      modelo_generador,
      kva,
      serie_generador,
      observaciones_finales,
      // Parámetros de operación
      parametros_operacion,
      // Verificaciones
      verificaciones
    } = req.body;

    console.log('🔍 [CREAR REPORTE] Campos principales:', {
      fecha,
      id_cliente,
      id_tecnico,
      id_administrador,
      direccion,
      ciudad,
      telefono,
      encargado,
      marca_generador,
      modelo_generador
    });

    // Validar cliente
    if (!id_cliente) {
      return res.status(400).json({ 
        error: 'El ID del cliente es requerido' 
      });
    }

    console.log('💾 [CREAR REPORTE] Guardando reporte con id_cliente:', id_cliente, 'tipo:', typeof id_cliente);

    // Crear el reporte principal
    const nuevoReporte = await reporteRepo.crearReporte({
      fecha,
      id_cliente,
      id_tecnico,
      id_administrador,
      direccion,
      ciudad,
      telefono,
      encargado,
      marca_generador,
      modelo_generador,
      kva,
      serie_generador,
      observaciones_finales
    });

    console.log('✅ [CREAR REPORTE] Reporte creado con ID:', nuevoReporte.id, 'para id_cliente:', nuevoReporte.id_cliente);

    // Crear parámetros de operación si existen
    let parametrosCreados = [];
    if (parametros_operacion) {
      const parametrosArray = Array.isArray(parametros_operacion) 
        ? parametros_operacion 
        : [parametros_operacion];

      for (const param of parametrosArray) {
        const parametroCreado = await reporteRepo.crearParametrosOperacion({
          reporte_id: nuevoReporte.id,
          presion_aceite: param.presion_aceite,
          temperatura_aceite: param.temperatura_aceite,
          temperatura_refrigerante: param.temperatura_refrigerante,
          fugas_aceite: param.fugas_aceite || false,
          fugas_combustible: param.fugas_combustible || false,
          frecuencia_rpm: param.frecuencia_rpm,
          voltaje_salida: param.voltaje_salida
        });
        parametrosCreados.push(parametroCreado);
      }
      console.log('Parámetros creados:', parametrosCreados.length);
    }

    // Crear verificaciones si existen
    let verificacionesCreadas = [];
    if (verificaciones && Array.isArray(verificaciones) && verificaciones.length > 0) {
      const verificacionesConReporteId = verificaciones.map(v => ({
        reporte_id: nuevoReporte.id,
        item: v.item,
        visto: v.visto || false,
        observacion: v.observacion || null
      }));

      verificacionesCreadas = await reporteRepo.crearVerificaciones(verificacionesConReporteId);
      console.log('Verificaciones creadas:', verificacionesCreadas.length);
    }

    // Buscar información del cliente
    const cliente = await ClienteModel.Cliente.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const clienteInfo = {
      nombre: cliente.nombre,
      telefono: cliente.telefono || 'No especificado',
      correo: cliente.correo_electronico
    };

    // Buscar información del técnico
    const tecnico = await TecnicoModel.Tecnico.findByPk(id_tecnico);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }

    const tecnicoInfo = {
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      telefono: tecnico.telefono || 'No especificado',
      correo: tecnico.correo_electronico
    };

    // Generar PDF
    const pdfPath = await generarPDFReporte(
      nuevoReporte,
      clienteInfo,
      tecnicoInfo,
      parametrosCreados,
      verificacionesCreadas
    );

    console.log('PDF generado en:', pdfPath);

    // Subir PDF a Cloudinary
    console.log('=== SUBIENDO PDF A CLOUDINARY ===');
    let pdfUrl;
    try {
      const timestamp = Date.now();
      console.log('Llamando a uploadPDFToCloudinary con:', pdfPath);
      const cloudinaryResult = await uploadPDFToCloudinary(
        pdfPath,
        `reporte_mantenimiento_${nuevoReporte.id}_${timestamp}`
      );
      console.log('Resultado de Cloudinary:', cloudinaryResult);
      pdfUrl = cloudinaryResult.url;
      console.log('✅ PDF subido exitosamente a Cloudinary');
      console.log('✅ URL asignada:', pdfUrl);
    } catch (cloudinaryError) {
      console.error('❌ Error al subir PDF a Cloudinary:', cloudinaryError.message);
      console.error('Stack:', cloudinaryError.stack);
      console.log('⚠️ Continuando con ruta local');
      pdfUrl = pdfPath;
    }

    // Actualizar el reporte con la URL del PDF
    console.log('Guardando en BD la URL:', pdfUrl);
    await nuevoReporte.update({ pdf_path: pdfUrl });
    console.log('✅ URL del PDF guardada en la base de datos');

    // Enviar email al cliente
    const correo = clienteInfo.correo;
    const subject = 'Reporte de Mantenimiento - Planta Eléctrica';
    
    let emailBody;
    let attachmentPath = null;

    if (pdfUrl.includes('cloudinary.com')) {
      emailBody = `Estimado/a ${clienteInfo.nombre},\n\nSu reporte de mantenimiento de planta eléctrica realizado el ${new Date(fecha).toLocaleDateString('es-CO')} está disponible en el siguiente enlace:\n\n${pdfUrl}\n\nSaludos cordiales,\nA-C Soluciones`;
    } else {
      emailBody = `Estimado/a ${clienteInfo.nombre},\n\nAdjunto encontrará el reporte de mantenimiento de su planta eléctrica realizado en fecha ${new Date(fecha).toLocaleDateString('es-CO')}.\n\nSaludos cordiales,\nA-C Soluciones`;
      attachmentPath = pdfPath;
    }

    try {
      const emailPromise = sendEmail(
        correo,
        subject,
        emailBody,
        attachmentPath
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email timeout')), 25000)
      );

      await Promise.race([emailPromise, timeoutPromise]);
      console.log('Email enviado correctamente');
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No devolvemos error, solo lo registramos
    }

    res.status(201).json({
      mensaje: 'Reporte de mantenimiento creado correctamente y enviado al cliente.',
      reporte: {
        id: nuevoReporte.id,
        fecha: nuevoReporte.fecha,
        cliente: clienteInfo.nombre,
        tecnico: `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`,
        pdf_generado: pdfUrl,
        parametros: parametrosCreados.length,
        verificaciones: verificacionesCreadas.length
      }
    });

  } catch (error) {
    console.error('Error en crearReporteMantenimiento:', error);

    if (error instanceof ValidationError) {
      const errors = error.errors.map(err => ({
        path: err.path,
        message: err.message
      }));
      return res.status(400).json({ errors });
    }

    res.status(500).json({ 
      message: 'Error al crear el reporte de mantenimiento',
      error: error.message 
    });
  }
};

export const listarReportes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    console.log('🔍 [REPORTE MANTENIMIENTO] Usuario autenticado:', {
      id: req.user.id,
      rol: req.user.rol,
      email: req.user.email
    });

    let reportes;

    if (req.user.rol === 'admin' || req.user.rol === 'administrador') {
      console.log('📋 Admin solicitando todos los reportes de mantenimiento');
      reportes = await reporteRepo.obtenerTodosReportes();
    } else if (req.user.rol === 'cliente') {
      console.log('🧑 Cliente solicitando reportes de mantenimiento con id:', req.user.id);
      reportes = await reporteRepo.obtenerReportesPorCliente(req.user.id);
      console.log('📊 Reportes encontrados para cliente:', reportes.length);
      if (reportes.length > 0) {
        console.log('📝 IDs de reportes encontrados:', reportes.map(r => ({ id: r.id, id_cliente: r.id_cliente })));
      }
    } else if (req.user.rol === 'tecnico') {
      console.log('🔧 Técnico solicitando reportes de mantenimiento con id:', req.user.id);
      reportes = await reporteRepo.obtenerReportesPorTecnico(req.user.id);
    } else {
      return res.status(403).json({ error: 'No tiene permisos para listar reportes' });
    }

    res.status(200).json({
      mensaje: 'Reportes obtenidos correctamente',
      total: reportes.length,
      reportes
    });

  } catch (error) {
    console.error('Error en listarReportes:', error);
    res.status(500).json({ 
      message: 'Error al listar los reportes',
      error: error.message 
    });
  }
};

export const obtenerReportePorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const reporte = await reporteRepo.obtenerReportePorId(id);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // Verificar permisos
    if (req.user.rol === 'cliente' && reporte.id_cliente !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permisos para ver este reporte' });
    }

    if (req.user.rol === 'tecnico' && reporte.id_tecnico !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permisos para ver este reporte' });
    }

    res.status(200).json({
      mensaje: 'Reporte obtenido correctamente',
      reporte
    });

  } catch (error) {
    console.error('Error en obtenerReportePorId:', error);
    res.status(500).json({ 
      message: 'Error al obtener el reporte',
      error: error.message 
    });
  }
};

export const descargarPDF = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const reporte = await reporteRepo.obtenerReportePorId(id);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // Verificar permisos
    if (req.user.rol === 'cliente' && reporte.id_cliente !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permisos para descargar este reporte' });
    }

    if (req.user.rol === 'tecnico' && reporte.id_tecnico !== req.user.id) {
      return res.status(403).json({ error: 'No tiene permisos para descargar este reporte' });
    }

    // Si el PDF está en Cloudinary, redirigir
    if (reporte.pdf_path && reporte.pdf_path.includes('cloudinary.com')) {
      return res.redirect(reporte.pdf_path);
    }

    // Si no está en Cloudinary, buscar el archivo local
    // Obtener información del cliente y técnico para regenerar el PDF si es necesario
    const cliente = await ClienteModel.Cliente.findByPk(reporte.id_cliente);
    const tecnico = await TecnicoModel.Tecnico.findByPk(reporte.id_tecnico);

    if (!cliente || !tecnico) {
      return res.status(404).json({ error: 'Información del reporte no encontrada' });
    }

    const clienteInfo = {
      nombre: cliente.nombre,
      telefono: cliente.telefono || 'No especificado',
      correo: cliente.correo_electronico
    };

    const tecnicoInfo = {
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      telefono: tecnico.telefono || 'No especificado',
      correo: tecnico.correo_electronico
    };

    // Generar el PDF
    const pdfPath = await generarPDFReporte(
      reporte,
      clienteInfo,
      tecnicoInfo,
      reporte.parametros || [],
      reporte.verificaciones || []
    );

    // Descargar el PDF
    res.download(pdfPath, `reporte_mantenimiento_${reporte.id}.pdf`, (err) => {
      if (err) {
        console.error('Error al descargar PDF:', err);
        res.status(500).json({ error: 'Error al descargar el PDF' });
      }
    });

  } catch (error) {
    console.error('Error en descargarPDF:', error);
    res.status(500).json({ 
      message: 'Error al descargar el PDF',
      error: error.message 
    });
  }
};
