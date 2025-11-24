import { useEffect, useState } from "react";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import { handleUpdateClient } from "../../controllers/administrator/updateClient.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditClientAd = ({ selected, onClose, onSuccess }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await handleGetClient(selected.id);
        setClientData(response.data);
      } catch (error) {
        console.error("Error al cargar cliente:", error);
      }
    };

    if (selected?.id) fetchClient();
  }, [selected]);

  if (!clientData) return null;

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "direccion", label: "Dirección", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const initialData = {
    numero_de_cedula: clientData.numero_de_cedula || "",
    nombre: clientData.nombre || "",
    apellido: clientData.apellido || "",
    correo_electronico: clientData.correo_electronico || "",
    direccion: clientData.direccion || "",
    telefono: clientData.telefono || "",
    estado: clientData.estado || "",
  };

  const handleSubmit = async (data) => {
    console.log('Datos a enviar:', data); // ← Verifica qué se está enviando
    await handleUpdateClient(selected.id, data);
  };

  return (
    <BaseEditModal
      title={`Editar cliente: ${clientData.nombre} ${clientData.apellido}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Cliente actualizado exitosamente!"
    />
  );
};

export default EditClientAd;
