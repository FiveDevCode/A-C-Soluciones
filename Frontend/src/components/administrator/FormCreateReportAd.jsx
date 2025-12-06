import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceSheet } from "../../controllers/common/createMaintenanceSheet.controller";
import { handleGetClientVisit } from "../../controllers/common/getClientVisit.controller";
import { handleGetTechnicalVisit } from "../../controllers/common/getTechnicalVisit.controller";

const FormCreateReportAd = ({ id, onClose, onSuccess }) => {
  const steps = [
    {
      title: "Información General",
      fields: [
        { name: "introduccion", label: "Introducción", type: "textarea" },
        { name: "fecha_de_mantenimiento", label: "Fecha del mantenimiento", type: "date" },
        { name: "detalles_servicio", label: "Detalles del servicio", type: "textarea" },
      ]
    },
    {
      title: "Estado Antes",
      fields: [
        { name: "estado_antes", label: "Estado antes", type: "textarea" },
        { name: "foto_estado_antes", label: "Foto estado antes", type: "file" },
        { name: "observaciones", label: "Observaciones", type: "textarea" },
      ]
    },
    {
      title: "Trabajo Realizado",
      fields: [
        { name: "descripcion_trabajo", label: "Descripción del trabajo", type: "textarea" },
        { name: "foto_descripcion_trabajo", label: "Foto del trabajo", type: "file" },
        { name: "materiales_utilizados", label: "Materiales utilizados", type: "textarea" },
      ]
    },
    {
      title: "Finalización",
      fields: [
        { name: "estado_final", label: "Estado final", type: "textarea" },
        { name: "foto_estado_final", label: "Foto estado final", type: "file" },
        { name: "tiempo_de_trabajo", label: "Tiempo de trabajo", type: "text" },
        { name: "recomendaciones", label: "Recomendaciones", type: "textarea" },
      ]
    }
  ];

  const handleSubmit = async (data) => {
    
    try {
      const id_cliente = await handleGetClientVisit(id);

      const id_tecnico = await handleGetTechnicalVisit(id);

      await handleCreateMaintenanceSheet({
        ...data,
        id_cliente: id_cliente,
        id_tecnico: id_tecnico,
        id_visitas: parseInt(id),
      });
      
    } catch (error) {
      
      throw error; 
    }
  };


  return (
    <BaseFormModal
      title="Crear reporte"
      steps={steps}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡El reporte fue creado con éxito!"
    />
  );
};

export default FormCreateReportAd;
