import path from 'path';
import { ClienteModel } from '../models/cliente.model.js';
import { generarPDF } from '../services/ficha_mantenimiento.services.js';
import { sendEmail } from '../services/email.services.js';
import * as fichaRepo from '../repository/ficha_mantenimiento.repository.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ValidationError, DatabaseError } from 'sequelize';
import * as notificacionService from '../services/notificacion.services.js';

export const crearFichaMantenimiento = async (req, res) => {
  

  try {
    console.log('req.body:', req.body);

    // Extraer campos del cuerpo
    const {
      id_cliente,
      id_tecnico,
      introduccion,
      detalles_servicio,
      observaciones,
      estado_antes,
      descripcion_trabajo,
      materiales_utilizados,
      estado_final,
      tiempo_de_trabajo,
      recomendaciones,
      fecha_de_mantenimiento,
      id_visitas
    } = req.body;

    // Log específico de los campos requeridos
    console.log('Campos requeridos extraídos:', {
      id_cliente,
      id_tecnico,
      introduccion,
      detalles_servicio,
      observaciones,
      estado_antes,
      descripcion_trabajo,
      materiales_utilizados,
      estado_final,
      tiempo_de_trabajo,
      recomendaciones,
      fecha_de_mantenimiento,
      id_visitas
    });

    // Validar tipo de cliente y requisito de visita
    if (id_cliente) {
      const cliente = await ClienteModel.Cliente.findByPk(id_cliente);
      if (!cliente) {
        return res.status(404).json({ 
          error: 'Cliente no encontrado' 
        });
      }

      // Si es cliente regular, requiere id_visitas
      if (cliente.tipo_cliente === 'regular' && !id_visitas) {
        return res.status(400).json({ 
          error: 'Los clientes regulares requieren una visita asociada. Por favor seleccione una visita.' 
        });
      }

      // Si es cliente fijo, NO debe tener id_visitas
      if (cliente.tipo_cliente === 'fijo' && id_visitas) {
        return res.status(400).json({ 
          error: 'Los clientes fijos no requieren visitas. Este campo debe estar vacío.' 
        });
      }
    }

    // Extraer archivos si están presentes
    const fotoAntes = req.files?.foto_estado_antes?.[0];
    const fotoFinal = req.files?.foto_estado_final?.[0];
    const fotoDescripcion = req.files?.foto_descripcion_trabajo?.[0];

    // Log de los archivos subidos
    console.log('Archivos recibidos:', {
      fotoAntes: fotoAntes?.filename,
      fotoFinal: fotoFinal?.filename,
      fotoDescripcion: fotoDescripcion?.filename,
    });

    // Crear objeto para guardar
    console.log('=== INTENTANDO CREAR FICHA EN BD ===');
    const nuevaFicha = await fichaRepo.crearFicha({
      id_cliente,
      id_tecnico,
      fecha_de_mantenimiento,
      introduccion,
      detalles_servicio,
      observaciones,
      estado_antes,
      descripcion_trabajo,
      materiales_utilizados,
      estado_final,
      tiempo_de_trabajo,
      recomendaciones,
      id_visitas,
      foto_estado_antes: fotoAntes?.filename || null,
      foto_estado_final: fotoFinal?.filename || null,
      foto_descripcion_trabajo: fotoDescripcion?.filename || null,
    });
    console.log('✓ Ficha creada en BD:', nuevaFicha.id);

    // Buscar cliente
    console.log('=== BUSCANDO CLIENTE ===');
    const cliente = await ClienteModel.Cliente.findByPk(id_cliente);
    if (!cliente) {
      console.error('Cliente no encontrado con ID:', id_cliente);
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    console.log('✓ Cliente encontrado:', cliente.nombre);

    const clienteInfo = {
      nombre: cliente.nombre,
      telefono: cliente.telefono || 'No especificado',
      correo: cliente.correo_electronico,
    };

    // Buscar técnico
    console.log('=== BUSCANDO TÉCNICO ===');
    const tecnico = await TecnicoModel.Tecnico.findByPk(id_tecnico);
    if (!tecnico) {
      console.error('Técnico no encontrado con ID:', id_tecnico);
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }
    console.log('✓ Técnico encontrado:', tecnico.nombre, tecnico.apellido);

    const tecnicoInfo = {
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      telefono: tecnico.telefono || 'No especificado',
      correo: tecnico.correo_electronico,
    };

    // Ruta de imágenes para pasar al PDF
    console.log('=== PREPARANDO RUTAS DE IMÁGENES ===');
    const imagenes = {
      estadoAntes: fotoAntes ? path.resolve('uploads', 'fotos_fichas', fotoAntes.filename) : null,
      estadoFinal: fotoFinal ? path.resolve('uploads', 'fotos_fichas', fotoFinal.filename) : null,
      descripcion: fotoDescripcion ? path.resolve('uploads', 'fotos_fichas', fotoDescripcion.filename) : null,
    };
    console.log('Rutas de imágenes:', imagenes);

    // Generar PDF
    console.log('=== GENERANDO PDF ===');
    const pdfPath = await generarPDF(nuevaFicha, clienteInfo, tecnicoInfo, imagenes);
    console.log('✓ PDF generado en:', pdfPath);

    // Guardar path PDF en BD
    console.log('=== ACTUALIZANDO PATH DEL PDF EN BD ===');
    await fichaRepo.actualizarPDFPath(nuevaFicha.id, pdfPath);
    console.log('✓ Path actualizado en BD');

    // Enviar email con PDF
    console.log('=== ENVIANDO EMAIL ===');
    await sendEmail(clienteInfo.correo, 'Ficha de mantenimiento', 'Adjunto encontrarás la ficha generada.', pdfPath);
    console.log('✓ Email enviado a:', clienteInfo.correo);
    
    // Notificar al cliente sobre la ficha creada
    console.log('=== ENVIANDO NOTIFICACIONES ===');
    await notificacionService.notificarFichaCreada(
      id_cliente,
      nuevaFicha.id,
      `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`
    ).catch(err => console.error('Error al enviar notificación al cliente:', err));
    
    // Notificar al técnico sobre la ficha asignada
    await notificacionService.notificarTecnicoFichaAsignada(
      id_tecnico,
      nuevaFicha.id,
      clienteInfo.nombre
    ).catch(err => console.error('Error al enviar notificación al técnico:', err));
    console.log('✓ Notificaciones enviadas');

    console.log('=== FICHA CREADA EXITOSAMENTE ===');
    res.status(201).json({
      mensaje: 'Ficha creada correctamente y enviada al cliente.',
      ficha: {
        ...nuevaFicha.toJSON(),
        pdf_path: pdfPath,
      },
    });

  } catch (error) {
    console.error('╔════════════════════════════════════════════════════════╗');
    console.error('║     ERROR COMPLETO en crearFichaMantenimiento         ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error('🔴 Tipo de Error:', error.constructor.name);
    console.error('🔴 Mensaje:', error.message);
    console.error('🔴 Stack:', error.stack);
    
    // Errores de Sequelize
    if (error instanceof ValidationError) {
      console.error('⚠️  ERRORES DE VALIDACIÓN:');
      const errors = error.errors.map(err => ({
        campo: err.path,
        tipo: err.type,
        mensaje: err.message,
        valor: err.value
      }));
      console.error(JSON.stringify(errors, null, 2));
      console.error('════════════════════════════════════════════════════════\n');
      
      return res.status(400).json({ 
        error: 'Error de validación',
        errores: errors
      });
    }

    if (error instanceof DatabaseError) {
      console.error('⚠️  ERROR DE BASE DE DATOS:');
      console.error('SQL:', error.sql);
      console.error('Parameters:', error.parameters);
      console.error('════════════════════════════════════════════════════════\n');
      
      return res.status(500).json({
        error: 'Error de base de datos',
        message: error.message
      });
    }

    // Otros errores
    console.error('🔴 Error completo (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('════════════════════════════════════════════════════════\n');

    res.status(500).json({ 
      error: 'Error al crear la ficha',
      message: error.message,
      tipo: error.constructor.name,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};



export const listarFichas = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado (req.user no existe)" });
    }

    const { rol, id } = req.user;
    const { id_visitas } = req.query; 

    let fichas;

    if (rol === 'admin' || rol === 'administrador') {
      fichas = await fichaRepo.obtenerTodasFichas(id_visitas);
    } else if (rol === 'tecnico') {
      // El técnico solo ve sus propias fichas, opcionalmente filtradas por visita
      fichas = await fichaRepo.obtenerFichasPorTecnico(id, id_visitas);
    } else if (rol === 'cliente') {
      fichas = await fichaRepo.obtenerFichasPorCliente(id, id_visitas);
    } else {
      return res.status(403).json({ error: 'Rol no autorizado' });
    }

    res.json(fichas);

  } catch (error) {
    console.error('Error al listar fichas:', error);
    res.status(500).json({ error: 'Error interno al obtener fichas' });
  }
};


export const obtenerFichasPorCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;

    if (!idCliente) {
      return res.status(400).json({ error: 'El idCliente es requerido' });
    }

    const fichas = await fichaRepo.obtenerFichasPorCliente(idCliente);

    if (!fichas || fichas.length === 0) {
      return res.status(404).json({ mensaje: 'No hay fichas para este cliente' });
    }

    res.status(200).json({
      mensaje: 'Fichas obtenidas correctamente',
      fichas
    });

  } catch (error) {
    console.error('Error al obtener fichas por cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const obtenerFichasPorTecnico = async (req, res) => {
  try {
    const { id_tecnico } = req.params;

    if (!id_tecnico) {
      return res.status(400).json({ error: 'El id tecnico es requerido' });
    }

    const fichas = await fichaRepo.obtenerFichasPorTecnico(id_tecnico);

    if (!fichas || fichas.length === 0) {
      return res.status(404).json({ mensaje: 'No hay fichas para este técnico' });
    }

    return res.status(200).json({
      mensaje: 'Fichas obtenidas correctamente',
      fichas
    });

  } catch (error) {
    console.error('Error al obtener fichas por técnico:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
