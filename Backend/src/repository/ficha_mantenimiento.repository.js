import { FichaModel } from '../models/ficha_mantenimiento.model.js';
import { VisitaModel } from '../models/visita.model.js';
import { SolicitudModel } from '../models/solicitud.model.js';
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ServicioModel } from '../models/servicios.model.js';


export const crearFicha = async (data) => {
  return await FichaModel.FichaMantenimiento.create(data);
};

export const actualizarPDFPath = async (id, path) => {
  return await FichaModel.FichaMantenimiento.update(
    { pdf_path: path },
    { where: { id } }
  );
};



export const obtenerTodasFichas = async (id_visitas = null) => {
  const where = {};
  if (id_visitas) {
    where.id_visitas = id_visitas;
  }

  return await FichaModel.FichaMantenimiento.findAll({
    where,
    include: [
      {
        model: VisitaModel.Visita,
        as: 'visita_asociada',
        required: false, // LEFT JOIN - incluye fichas sin visita
        attributes: [
          'id',
          'fecha_programada',
          'duracion_estimada',
          'estado',
          'notas'
        ],
        include: [
          {
            model: SolicitudModel.Solicitud,
            as: 'solicitud_asociada',
            attributes: ['id', 'descripcion', 'direccion_servicio', 'comentarios'],
            include: [
              {
                model: ClienteModel.Cliente,
                as: 'cliente_solicitud',
                attributes: ['id', 'nombre', 'apellido', 'numero_de_cedula']
              }
            ]
          },
          {
            model: ServicioModel.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre']
          }
        ]
      },
      {
        model: ClienteModel.Cliente,
        as: 'cliente_ficha',
        attributes: ['id', 'nombre', 'apellido', 'numero_de_cedula']
      },
      {
        model: TecnicoModel.Tecnico,
        as: 'tecnico_ficha',
        attributes: ['id', 'nombre', 'apellido', 'especialidad']
      }
    ],
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};

export const obtenerFichasPorCliente = async (id_cliente, id_visitas = null) => {
  const where = { id_cliente };
  if (id_visitas) {
    where.id_visitas = id_visitas;
  }

  return await FichaModel.FichaMantenimiento.findAll({
    where,
    include: [
      {
        model: VisitaModel.Visita,
        as: 'visita_asociada',
        required: false,
        attributes: [
          'id',
          'fecha_programada',
          'duracion_estimada',
          'estado',
          'notas'
        ],
        include: [
          {
            model: SolicitudModel.Solicitud,
            as: 'solicitud_asociada',
            attributes: ['id', 'descripcion', 'direccion_servicio']
          },
          {
            model: ServicioModel.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre']
          }
        ]
      },
      {
        model: TecnicoModel.Tecnico,
        as: 'tecnico_ficha',
        attributes: ['id', 'nombre', 'apellido', 'especialidad']
      }
    ],
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};

export const obtenerFichasPorTecnico = async (id_tecnico, id_visitas = null) => {
  const where = { id_tecnico };
  if (id_visitas) {
    where.id_visitas = id_visitas;
  }

  return await FichaModel.FichaMantenimiento.findAll({
    where,
    include: [
      {
        model: VisitaModel.Visita,
        as: 'visita_asociada',
        required: false,
        attributes: [
          'id',
          'fecha_programada',
          'duracion_estimada',
          'estado',
          'notas'
        ],
        include: [
          {
            model: SolicitudModel.Solicitud,
            as: 'solicitud_asociada',
            attributes: ['id', 'descripcion', 'direccion_servicio'],
            include: [
              {
                model: ClienteModel.Cliente,
                as: 'cliente_solicitud',
                attributes: ['id', 'nombre', 'apellido', 'numero_de_cedula']
              }
            ]
          },
          {
            model: ServicioModel.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre']
          }
        ]
      },
      {
        model: ClienteModel.Cliente,
        as: 'cliente_ficha',
        attributes: ['id', 'nombre', 'apellido', 'numero_de_cedula']
      }
    ],
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};
