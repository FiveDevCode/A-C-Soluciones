import path from 'path';
import { ClienteModel } from '../models/cliente.model.js';
import { generarPDF } from '../services/ficha_mantenimiento.services.js';
import { sendEmail } from '../services/email.services.js';
import * as fichaRepo from '../repository/ficha_mantenimiento.repository.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ValidationError } from 'sequelize';
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

    // Buscar cliente
    const cliente = await ClienteModel.Cliente.findByPk(id_cliente);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    const clienteInfo = {
      nombre: cliente.nombre,
      telefono: cliente.telefono || 'No especificado',
      correo: cliente.correo_electronico,
    };

    // Buscar técnico
    const tecnico = await TecnicoModel.Tecnico.findByPk(id_tecnico);
    if (!tecnico) return res.status(404).json({ error: 'Técnico no encontrado' });

    const tecnicoInfo = {
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      telefono: tecnico.telefono || 'No especificado',
      correo: tecnico.correo_electronico,
    };

    // Ruta de imágenes para pasar al PDF
    const imagenes = {
      estadoAntes: fotoAntes ? path.resolve('uploads', 'fotos_fichas', fotoAntes.filename) : null,
      estadoFinal: fotoFinal ? path.resolve('uploads', 'fotos_fichas', fotoFinal.filename) : null,
      descripcion: fotoDescripcion ? path.resolve('uploads', 'fotos_fichas', fotoDescripcion.filename) : null,
    };

    // Generar PDF

    const pdfPath = await generarPDF(nuevaFicha, clienteInfo, tecnicoInfo, imagenes);

    // Guardar path PDF en BD
    await fichaRepo.actualizarPDFPath(nuevaFicha.id, pdfPath);

    // Enviar email con PDF
    await sendEmail(clienteInfo.correo, 'Ficha de mantenimiento', 'Adjunto encontrarás la ficha generada.', pdfPath);
    
    // Notificar al cliente sobre la ficha creada
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

    res.status(201).json({
      mensaje: 'Ficha creada correctamente y enviada al cliente.',
      ficha: {
        ...nuevaFicha.toJSON(),
        pdf_path: pdfPath,
      },
    });

  } catch (error) {
    console.error('Error en crearFichaMantenimiento:', error);

    if (error instanceof ValidationError) {
      const errors = error.errors.map(err => ({
        path: err.path,
        message: err.message
      }));
      return res.status(400).json({ errors }); 
    }

    res.status(500).json({ message: 'Error al crear la ficha' });
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
      fichas = await fichaRepo.obtenerTodasFichas(id_visitas); //CORRECCION: esta es para todas las fichas no solo las que maneja tecnico corregir eso
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
