import { useEffect, useState } from "react";
import { handleGetService } from "../../controllers/administrator/getServiceAd.controller";
import { handleUpdateServiceAd } from "../../controllers/administrator/updateServiceAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditServiceAd = ({ selected, onClose, onSuccess }) => {
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await handleGetService(selected.id);
        setServiceData(response.data);
      } catch (error) {
        console.error("Error al cargar servicio:", error);
      }
    };
    if (selected?.id) fetchService();
  }, [selected]);

  if (!serviceData) return null; // no mostrar nada mientras carga

  const estados = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_proceso", label: "En proceso" },
    { value: "completado", label: "Completado" },
  ];

  const fields = [
    { name: "nombre", label: "Nombre del servicio", type: "text" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const initialData = {
    nombre: serviceData.nombre || "",
    descripcion: serviceData.descripcion || "",
    estado: serviceData.estado || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateServiceAd(selected.id, data);
  };

  return (
    <BaseEditModal
      title={`Editar servicio: ${serviceData.nombre}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Servicio actualizado exitosamente!"
    />
  );
};

export default EditServiceAd;
