import { useState } from "react";
import { useParams } from "react-router-dom";
import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceSheet } from "../../controllers/common/createMaintenanceSheet.controller";
import { handleGetClientVisit } from "../../controllers/common/getClientVisit.controller";
import { handleGetTechnicalVisit } from "../../controllers/common/getTechnicalVisit.controller";

const FormCreateReportAd = ({ onClose, onSuccess }) => {
  const { id } = useParams();

  // imágenes iguales a tu formulario original
  const [imagenes, setImagenes] = useState({
    foto_estado_antes: null,
    foto_estado_final: null,
    foto_descripcion_trabajo: null,
  });

  // campos de texto EXACTOS de tu primer formulario
  const fields = [
    { name: "introduccion", label: "Introducción", type: "textarea" },
    { name: "fecha_de_mantenimiento", label: "Fecha del mantenimiento", type: "date" },
    { name: "detalles_servicio", label: "Detalles del servicio", type: "textarea" },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
    { name: "estado_antes", label: "Estado antes", type: "textarea" },
    { name: "descripcion_trabajo", label: "Descripción del trabajo", type: "textarea" },
    { name: "materiales_utilizados", label: "Materiales utilizados", type: "text" },
    { name: "estado_final", label: "Estado final", type: "text" },
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
      foto_estado_antes: imagenes.foto_estado_antes,
      foto_descripcion_trabajo: imagenes.foto_descripcion_trabajo,
      foto_estado_final: imagenes.foto_estado_final,
    });
  };

  const extraContent = (
    <div style={{ marginTop: "1rem" }}>
      {/* Imagen estado antes */}
      <label className="upload-label">
        Subir imagen "Estado antes"
        <input
          type="file"
          hidden
          onChange={(e) =>
            setImagenes((prev) => ({
              ...prev,
              foto_estado_antes: e.target.files[0],
            }))
          }
        />
      </label>

      {/* Imagen descripción del trabajo */}
      <label className="upload-label">
        Subir imagen "Descripción del trabajo"
        <input
          type="file"
          hidden
          onChange={(e) =>
            setImagenes((prev) => ({
              ...prev,
              foto_descripcion_trabajo: e.target.files[0],
            }))
          }
        />
      </label>

      {/* Imagen estado final */}
      <label className="upload-label">
        Subir imagen "Estado final"
        <input
          type="file"
          hidden
          onChange={(e) =>
            setImagenes((prev) => ({
              ...prev,
              foto_estado_final: e.target.files[0],
            }))
          }
        />
      </label>
    </div>
  );

  return (
    <BaseFormModal
      title="Crear reporte"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡El reporte fue creado con éxito!"
      extraContent={extraContent}
    />
  );
};

export default FormCreateReportAd;
