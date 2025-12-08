import { FichaModel } from '../models/ficha_mantenimiento.model.js';



export const crearFicha = async (data) => {
  return await FichaModel.FichaMantenimiento.create(data);
};

export const actualizarPDFPath = async (id, path) => {
  return await FichaModel.FichaMantenimiento.update(
    { pdf_path: path },
    { where: { id } }
  );
};



export const obtenerFichaPorId = async (id) => {
  return await FichaModel.FichaMantenimiento.findByPk(id);
};

export const obtenerFichasPorCliente = async (id_cliente) => {
  return await FichaModel.FichaMantenimiento.findAll({
    where: { id_cliente },
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
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
}



export const obtenerTodasFichas = async (id_visitas) => {
  const where = {};
  if (id_visitas) where.id_visitas = id_visitas;

  return await FichaModel.FichaMantenimiento.findAll({
    where,
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};
