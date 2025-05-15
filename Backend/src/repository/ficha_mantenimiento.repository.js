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

export const obtenerFichasPorCliente = async (id_cliente) => {
  return await FichaModel.FichaMantenimiento.findAll({
    where: { id_cliente }
  });
};

export const obtenerFichaPorId = async (id) => {
  return await FichaModel.FichaMantenimiento.findByPk(id);
};

export const buscarPorCliente = async (idCliente) => {
  return await FichaModel.FichaMantenimiento.findAll({
    where: { id_cliente: idCliente },
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};

export const obtenerFichasPorTecnico = async (idTecnico) => {
  return await FichaModel.FichaMantenimiento.findAll({
    where: { id_tecnico: idTecnico },
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};

export const obtenerTodasFichas = async () => {
  return await FichaModel.FichaMantenimiento.findAll({
    order: [['fecha_de_mantenimiento', 'DESC']]
  });
};
