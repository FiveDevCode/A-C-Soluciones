import { ValidationError } from 'sequelize';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';
import { generarPDFReporteBombeo } from '../services/reporte_bombeo.services.js';
import { sendEmail } from '../services/email.services.js'; // Asumiendo que esta es tu función de envío
// Importar modelos o repositorios de entidades externas (Cliente, Tecnico)
import { ClienteModel } from '../models/cliente.model.js'; // Asegúrate de importar tus modelos reales
import { TecnicoModel } from '../models/tecnico.model.js'; // Asegúrate de importar tus modelos reales


export const crearReporteBombeo = async (req, res) => {
    try {
        const {
            fecha,
            cliente_id,
            tecnico_id,
            administrador_id,
            visita_id,
            direccion,
            ciudad,
            telefono,
            encargado,
            observaciones_finales,
            equipos,        
            parametrosLinea 
        } = req.body;

        // Validación básica
        if (!fecha || !cliente_id || !tecnico_id || !equipos || !parametrosLinea) {
            return res.status(400).json({ error: 'Faltan datos requeridos (fecha, cliente_id, tecnico_id, equipos, parametrosLinea).' });
        }

        // Validar tipo de cliente y requisito de visita
        const cliente = await ClienteModel.Cliente.findByPk(cliente_id);
        if (!cliente) {
            return res.status(404).json({ 
                error: 'Cliente no encontrado' 
            });
        }

        // Si es cliente regular, requiere visita_id
        if (cliente.tipo_cliente === 'regular' && !visita_id) {
            return res.status(400).json({ 
                error: 'Los clientes regulares requieren una visita asociada. Por favor seleccione una visita.' 
            });
        }

        // Si es cliente fijo, NO debe tener visita_id
        if (cliente.tipo_cliente === 'fijo' && visita_id) {
            return res.status(400).json({ 
                error: 'Los clientes fijos no requieren visitas. Este campo debe estar vacío.' 
            });
        }

        const reporteData = {
            fecha, cliente_id, tecnico_id, administrador_id, visita_id, direccion, ciudad, telefono, encargado, observaciones_finales
        };

        // 2. Crear el reporte completo en DB (Reporte, Equipos, Parámetros)
        const nuevoReporte = await reporteRepo.crearReporteCompleto(reporteData, equipos, parametrosLinea);

        // 3. Obtener información completa de Técnico para el PDF y el Email
        const tecnico = await TecnicoModel.Tecnico.findByPk(tecnico_id);

        if (!tecnico) {
             // Es buena práctica eliminar el reporte si falla la obtención de info clave
             // O simplemente devolver un error
             return res.status(404).json({ error: 'Técnico no encontrado para generar el PDF.' });
        }
        
        const clienteInfo = { 
            nombre: cliente.nombre, 
            correo: cliente.correo_electronico 
        };
        
        const tecnicoInfo = { 
            nombre: tecnico.nombre, 
            apellido: tecnico.apellido, 
            identificacion: tecnico.identificacion || 'N/A' // Asegúrate de incluir la identificación si existe
        };
        

        // 4. Generar PDF (Obtener el reporte completo con sus relaciones)
        const reporteCompleto = await reporteRepo.obtenerReportePorId(nuevoReporte.id);
        
        // La función de servicio ya no necesita el argumento de imágenes
        const pdfPath = await generarPDFReporteBombeo(
            reporteCompleto.toJSON(), 
            reporteCompleto.equipos.map(e => e.toJSON()), 
            reporteCompleto.parametrosLinea.toJSON(), 
            clienteInfo, 
            tecnicoInfo
        );

        // 5. Guardar path PDF en DB
        await reporteRepo.actualizarPDFPath(nuevoReporte.id, pdfPath);

        // 6. Enviar email al cliente con el PDF adjunto
        await sendEmail(clienteInfo.correo, `Reporte de Bombeo #${nuevoReporte.id}`, 'Adjunto encontrarás el reporte de mantenimiento de los equipos de bombeo.', pdfPath);

        res.status(201).json({
            mensaje: 'Reporte de Bombeo creado correctamente y enviado al cliente.',
            reporte: {
                ...nuevoReporte.toJSON(),
                pdf_path: pdfPath,
            },
        });

    } catch (error) {
        console.error('Error en crearReporteBombeo:', error);

        if (error instanceof ValidationError) {
            const errors = error.errors.map(err => ({
                path: err.path,
                message: err.message
            }));
            return res.status(400).json({ errors }); 
        }

        res.status(500).json({ message: 'Error interno al crear el reporte' });
    }
};


export const listarReportes = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado." });
        }

        const { rol, id } = req.user;
        const { visita_id } = req.query; // Filtro opcional por ID de visita

        let reportes;

        if (rol === 'admin' || rol === 'administrador') {
            // Admin ve todos los reportes, con filtro opcional de visita
            reportes = await reporteRepo.obtenerTodosReportes(visita_id);
        } else if (rol === 'tecnico') {
            // El técnico solo ve los reportes donde es responsable
            reportes = await reporteRepo.obtenerTodosReportes(visita_id); 
        } else if (rol === 'cliente') {
            // El cliente solo ve sus reportes
            reportes = await reporteRepo.obtenerReportesPorCliente(id); 
        } else {
            return res.status(403).json({ error: 'Rol no autorizado' });
        }

        res.json(reportes);

    } catch (error) {
        console.error('Error al listar reportes:', error);
        res.status(500).json({ error: 'Error interno al obtener reportes' });
    }
};

export const obtenerReportePorId = async (req, res) => {
    try {
        const { idReporte } = req.params;
        const reporte = await reporteRepo.obtenerReportePorId(idReporte);

        if (!reporte) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }
        
        // Opcional: Agregar lógica de autorización (solo cliente/técnico/admin asociado puede verlo)

        res.status(200).json(reporte);
    } catch (error) {
        console.error('Error al obtener reporte por ID:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};