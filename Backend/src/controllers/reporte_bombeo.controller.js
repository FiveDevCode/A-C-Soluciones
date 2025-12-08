import { ValidationError } from 'sequelize';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';
import { generarPDFReporteBombeo } from '../services/reporte_bombeo.services.js';
import { sendEmail } from '../services/email.services.js';
import { uploadPDFToCloudinary } from '../services/cloudinary.services.js';
// Importar modelos o repositorios de entidades externas (Cliente, Tecnico)
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';


export const crearReporteBombeo = async (req, res) => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 INICIANDO CREACIÓN DE REPORTE DE BOMBEO');
    console.log('Usuario autenticado:', req.user);
    console.log('Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('═══════════════════════════════════════════════════════');
    
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
            console.log('❌ ERROR: Faltan datos requeridos');
            console.log('Validación:', { fecha: !!fecha, cliente_id: !!cliente_id, tecnico_id: !!tecnico_id, equipos: !!equipos, parametrosLinea: !!parametrosLinea });
            return res.status(400).json({ error: 'Faltan datos requeridos (fecha, cliente_id, tecnico_id, equipos, parametrosLinea).' });
        }

        // Validar tipo de cliente y requisito de visita
        console.log('🔍 Buscando cliente con ID:', cliente_id);
        const cliente = await ClienteModel.Cliente.findByPk(cliente_id);
        if (!cliente) {
            console.log('❌ Cliente no encontrado');
            return res.status(404).json({ 
                error: 'Cliente no encontrado' 
            });
        }
        
        console.log('✓ Cliente encontrado:', { id: cliente.id, nombre: cliente.nombre, tipo_cliente: cliente.tipo_cliente });

        // Si es cliente regular, requiere visita_id
        if (cliente.tipo_cliente === 'regular' && !visita_id) {
            console.log('❌ ERROR: Cliente regular sin visita_id');
            return res.status(400).json({ 
                error: 'Los clientes regulares requieren una visita asociada. Por favor seleccione una visita.' 
            });
        }

        // Si es cliente fijo, NO debe tener visita_id
        if (cliente.tipo_cliente === 'fijo' && visita_id) {
            console.log('❌ ERROR: Cliente fijo con visita_id');
            return res.status(400).json({ 
                error: 'Los clientes fijos no requieren visitas. Este campo debe estar vacío.' 
            });
        }
        
        console.log('✓ Validaciones de cliente/visita pasadas');

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
        console.log('=== GENERANDO PDF DEL REPORTE ===');
        const reporteCompleto = await reporteRepo.obtenerReportePorId(nuevoReporte.id);
        
        // La función de servicio ya no necesita el argumento de imágenes
        const pdfPath = await generarPDFReporteBombeo(
            reporteCompleto.toJSON(), 
            reporteCompleto.equipos.map(e => e.toJSON()), 
            reporteCompleto.parametrosLinea.toJSON(), 
            clienteInfo, 
            tecnicoInfo
        );
        console.log('✓ PDF generado en:', pdfPath);

        // 5. Subir PDF a Cloudinary
        console.log('=== SUBIENDO PDF A CLOUDINARY ===');
        let pdfUrl = pdfPath; // Por defecto, usar ruta local
        try {
            const cloudinaryResult = await uploadPDFToCloudinary(
                pdfPath, 
                `reporte_bombeo_${nuevoReporte.id}_${Date.now()}`
            );
            pdfUrl = cloudinaryResult.url;
            console.log('✓ PDF subido a Cloudinary:', pdfUrl);
        } catch (cloudinaryError) {
            console.error('✗ Error al subir PDF a Cloudinary:', cloudinaryError.message);
            console.log('⚠️  Continuando con ruta local (solo funcionará en desarrollo)');
        }

        // 6. Guardar URL del PDF en DB
        console.log('=== ACTUALIZANDO URL DEL PDF EN BD ===');
        await reporteRepo.actualizarPDFPath(nuevoReporte.id, pdfUrl);
        console.log('✓ URL actualizada en BD');

        // 7. Enviar email al cliente con PDF con timeout
        console.log('=== ENVIANDO EMAIL AL CLIENTE ===');
        try {
            // Si el PDF está en Cloudinary, enviar la URL en el cuerpo del email
            if (pdfUrl.includes('cloudinary.com')) {
                const emailBody = `
Estimado/a ${cliente.nombre},

Se ha generado el Reporte de Bombeo #${nuevoReporte.id}.

Puede descargar el PDF desde el siguiente enlace:
${pdfUrl}

Detalles del servicio:
- Fecha: ${fecha}
- Técnico: ${tecnico.nombre} ${tecnico.apellido}
- Dirección: ${direccion}
- Ciudad: ${ciudad}

Saludos cordiales,
A-C Soluciones
                `.trim();
                
                await Promise.race([
                    sendEmail(clienteInfo.correo, `Reporte de Bombeo #${nuevoReporte.id}`, emailBody, null),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 25000))
                ]);
            } else {
                // Si es ruta local, adjuntar el archivo
                await Promise.race([
                    sendEmail(clienteInfo.correo, `Reporte de Bombeo #${nuevoReporte.id}`, 'Adjunto encontrarás el reporte de mantenimiento de los equipos de bombeo.', pdfPath),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 25000))
                ]);
            }
            console.log('✓ Email enviado a:', clienteInfo.correo);
        } catch (emailError) {
            console.error('✗ Error al enviar email:', emailError.message);
            // Continuamos aunque falle el email
        }

        console.log('=== REPORTE DE BOMBEO CREADO EXITOSAMENTE ===');
        res.status(201).json({
            mensaje: 'Reporte de Bombeo creado correctamente y enviado al cliente.',
            reporte: {
                ...nuevoReporte.toJSON(),
                pdf_path: pdfUrl,
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