import { ReporteBombeo } from '../models/reporte_bombeo.model.js';
import { EquipoBombeo } from '../models/equipoBombeo.model.js';
import { ParametroBombeo } from '../models/parametroBombeo.model.js';
import { sequelize } from '../database/conexion.js'; // 
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { AdminModel } from '../models/administrador.model.js';
import { VisitaModel } from '../models/visita.model.js';


export const crearReporteCompleto = async (data, equipos, parametros) => {
    return await sequelize.transaction(async (t) => {
        // 1. Crear el Reporte principal
        const nuevoReporte = await ReporteBombeo.create(data, { transaction: t });

        const equiposConReporteId = equipos.map(equipo => ({
            ...equipo,
            reporte_id: nuevoReporte.id
        }));
        await EquipoBombeo.bulkCreate(equiposConReporteId, { transaction: t });

        await ParametroBombeo.create({
            ...parametros,
            reporte_id: nuevoReporte.id
        }, { transaction: t });

        return nuevoReporte;
    });
};


export const obtenerReportePorId = async (id) => {
    return await ReporteBombeo.findByPk(id, {
        include: [
            { model: EquipoBombeo, as: 'equipos' },
            { model: ParametroBombeo, as: 'parametrosLinea' },
            { model: ClienteModel.Cliente, as: 'cliente_reporte' }, 
            { model: TecnicoModel.Tecnico, as: 'tecnico_reporte' },
            { model: AdminModel.Admin, as: 'administrador_reporte' },
            { model: VisitaModel.Visita, as: 'visita_reporte' }
        ]
    });
};


export const obtenerTodosReportes = async (visita_id = null) => {
    const where = {};
    if (visita_id) {
        where.visita_id = visita_id;
    }

    return await ReporteBombeo.findAll({
        where,
        order: [['fecha', 'DESC']],
        include: [
            { model: EquipoBombeo, as: 'equipos' },
            { model: ParametroBombeo, as: 'parametrosLinea' },
            
        ]
    });
};


export const obtenerReportesPorCliente = async (cliente_id) => {
    return await ReporteBombeo.findAll({
        where: { cliente_id },
        order: [['fecha', 'DESC']],
        include: [
             { model: EquipoBombeo, as: 'equipos' },
             { model: ParametroBombeo, as: 'parametrosLinea' },
        ]
    });
};

export const obtenerReportesPorTecnico = async (tecnico_id) => {
    return await ReporteBombeo.findAll({
        where: { tecnico_id },
        order: [['fecha', 'DESC']],
        include: [
             { model: EquipoBombeo, as: 'equipos' },
             { model: ParametroBombeo, as: 'parametrosLinea' },
        ]
    });
};

export const actualizarPDFPath = async (reporteId, pdfPath) => {
    const [updatedCount] = await ReporteBombeo.update(
        { pdf_path: pdfPath },
        { where: { id: reporteId } }
    );

    if (updatedCount === 0) {
        console.warn(`No se encontró el reporte con ID ${reporteId} para actualizar la ruta del PDF.`);
    }
};