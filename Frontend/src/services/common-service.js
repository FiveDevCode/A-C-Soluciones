
import axios from "axios";


const login = (email, password) => {
  return axios.post("http://localhost:8000/api/login", {
    correo_electronico: email,
    contrasenia: password,
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const createMaintenanceSheet = ({
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
  id_visitas,
  foto_estado_antes,
  foto_estado_final,
  foto_descripcion_trabajo
}) => {
  const token = sessionStorage.getItem("authToken");

  const formData = new FormData();

  formData.append("id_cliente", id_cliente);
  formData.append("id_tecnico", id_tecnico);
  formData.append("introduccion", introduccion);
  formData.append("detalles_servicio", detalles_servicio);
  formData.append("observaciones", observaciones);
  formData.append("estado_antes", estado_antes);
  formData.append("descripcion_trabajo", descripcion_trabajo);
  formData.append("materiales_utilizados", materiales_utilizados);
  formData.append("estado_final", estado_final);
  formData.append("tiempo_de_trabajo", tiempo_de_trabajo);
  formData.append("recomendaciones", recomendaciones);
  formData.append("fecha_de_mantenimiento", fecha_de_mantenimiento);
  formData.append("id_visitas", id_visitas);

  if (foto_estado_antes) formData.append("foto_estado_antes", foto_estado_antes);
  if (foto_estado_final) formData.append("foto_estado_final", foto_estado_final);
  if (foto_descripcion_trabajo) formData.append("foto_descripcion_trabajo", foto_descripcion_trabajo);

  return axios.post("http://localhost:8000/api/fichas", formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
};

const getPDFIdVisit = (id) => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/fichas?id_visitas=${id}`,{
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
}

const getListClient = () => {
  return axios.get("http://localhost:8000/api/cliente");

}

const getVisitId = (id_visita) => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/${id_visita}`,{
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
}

const getRequestId = (id_solicitud) => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/solicitudes/${id_solicitud}`,{
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
}

const updateStateVisit = (id_visit, state) => {
  const token = sessionStorage.getItem("authToken");

  return axios.put(`http://localhost:8000/api/visitas/${id_visit}`, {
    estado: state,
 

  }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

export const commonService = {
  login,
  createMaintenanceSheet,
  getPDFIdVisit,
  getListClient,
  getVisitId,
  getRequestId,
  updateStateVisit

}