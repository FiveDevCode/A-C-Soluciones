import { useEffect, useState } from "react";
import { handleGetTechnical } from "../../controllers/administrator/getTechnicalAd.controller";
import { handleUpdateTechnical } from "../../controllers/administrator/updateTechnicalAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditTechnicalAd = ({ selected, onClose, onSuccess }) => {
  const [technicalData, setTechnicalData] = useState(null);

  useEffect(() => {
    const fetchTechnical = async () => {
      try {
        const response = await handleGetTechnical(selected.id);
        setTechnicalData(response.data);
      } catch (error) {
        console.error("Error al cargar técnico:", error);
      }
    };
    if (selected?.id) fetchTechnical();
  }, [selected]);

  if (!technicalData) return null;

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "especialidad", label: "Especialidad", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const initialData = {
    numero_de_cedula: technicalData.numero_de_cedula || "",
    nombre: technicalData.nombre || "",
    apellido: technicalData.apellido || "",
    correo_electronico: technicalData.correo_electronico || "",
    especialidad: technicalData.especialidad || "",
    telefono: technicalData.telefono || "",
    estado: technicalData.estado || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateTechnical(selected.id, data);
  };

  return (
    <BaseEditModal
      title={`Editar técnico: ${technicalData.nombre} ${technicalData.apellido}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Técnico actualizado exitosamente!"
    />
  );
};

export default EditTechnicalAd;
