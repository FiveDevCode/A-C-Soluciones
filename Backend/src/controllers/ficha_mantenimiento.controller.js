import { ClienteModel } from '../models/cliente.model.js';
import { generarPDF } from '../services/ficha_mantenimiento.services.js';
import { sendEmail } from '../services/email.services.js';
import * as fichaRepo from '../repository/ficha_mantenimiento.repository.js';
import { TecnicoModel } from '../models/tecnico.model.js';

export const crearFichaMantenimiento = async (req, res) => {
  try {
    const data = req.body;

    const ficha = await fichaRepo.crearFicha(data);

    const cliente = await ClienteModel.Cliente.findByPk(ficha.id_cliente);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    const clienteInfo = {
      nombre: cliente.nombre,
      telefono: cliente.telefono || 'No especificado',
      correo: cliente.correo_electronico
    };

    const tecnico = await TecnicoModel.Tecnico.findByPk(ficha.id_tecnico); 
    if (!tecnico) return res.status(404).json({ error: 'Tecnico no encontrado'}); 
    const tecnicoInfo = {
      nombre: tecnico.nombre,
      apellido: tecnico.apellido, 
      telefono: cliente.telefono, 
      correo: tecnico.correo_electronico
    };  

    const pdfPath = await generarPDF(ficha, clienteInfo, tecnicoInfo);

    await fichaRepo.actualizarPDFPath(ficha.id, pdfPath);

    await sendEmail(clienteInfo.correo, 'Ficha de mantenimiento', 'Adjunto encontrarás la ficha generada.', pdfPath);

    res.status(201).json({
      mensaje: 'Ficha creada correctamente y enviada al cliente.',
      ficha: {
        ...ficha.toJSON(),
        pdf_path: pdfPath
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la ficha' });
  }
};

export const listarFichas = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado (req.user no existe)" });
    }

    const { rol, id } = req.user;

    let fichas;

    if (rol === 'admin' || rol === 'administrador') {
      fichas = await fichaRepo.obtenerTodasFichas();
    } else if (rol === 'tecnico') {
      fichas = await fichaRepo.obtenerFichasPorTecnico(id);
    } else if (rol === 'cliente') {
      fichas = await fichaRepo.obtenerFichasPorCliente(id);
    } else {
      return res.status(403).json({ error: 'Rol no autorizado' });
    }

    res.json(fichas);

  } catch (error) {
    console.error('Error al listar fichas:', error);
    res.status(500).json({ error: 'Error interno al obtener fichas' });
  }
};
