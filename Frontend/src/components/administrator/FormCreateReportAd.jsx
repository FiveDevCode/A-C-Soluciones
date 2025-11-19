import { useState } from "react";
import { useParams } from "react-router-dom";
import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceSheet } from "../../controllers/common/createMaintenanceSheet.controller";
import { handleGetClientVisit } from "../../controllers/common/getClientVisit.controller";
import { handleGetTechnicalVisit } from "../../controllers/common/getTechnicalVisit.controller";

const FormCreateReportAd = ({ onClose, onSuccess }) => {
  const { id } = useParams();

  const fields = [
    { name: "introduccion", label: "Introducción", type: "textarea" },
    { name: "fecha_de_mantenimiento", label: "Fecha del mantenimiento", type: "date" },
    { name: "detalles_servicio", label: "Detalles del servicio", type: "textarea" },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
    { name: "estado_antes", label: "Estado antes", type: "textarea" },

    { name: "foto_estado_antes", label: "Estado antes", type: "file" },

    { name: "descripcion_trabajo", label: "Descripción del trabajo", type: "textarea" },

    { name: "foto_descripcion_trabajo", label: "Descripción del trabajo", type: "file" },

    { name: "materiales_utilizados", label: "Materiales utilizados", type: "text" },
    { name: "estado_final", label: "Estado final", type: "text" },

    { name: "foto_estado_final", label: "Estado final", type: "file" },

    { name: "tiempo_de_trabajo", label: "Tiempo de trabajo", type: "text" },
    { name: "recomendaciones", label: "Recomendaciones", type: "textarea" },
  ];

  const handleSubmit = async (data) => {
    const id_cliente = await handleGetClientVisit(id);
    const id_tecnico = await handleGetTechnicalVisit(id);

    await handleCreateMaintenanceSheet({
      ...data,
      id_cliente: id_cliente,
      id_tecnico: id_tecnico,
      id_visitas: parseInt(id),
    });
  };

  return (
    <BaseFormModal
      title="Crear reporte"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡El reporte fue creado con éxito!"
    />
  );
};

export default FormCreateReportAd;
