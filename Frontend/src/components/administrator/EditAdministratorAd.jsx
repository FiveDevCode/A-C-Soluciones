import { useEffect, useState } from "react";
import { handleGetAdminId } from "../../controllers/administrator/getAdminIdAd.controller";
import { handleUpdateAdmin } from "../../controllers/administrator/updateAdminAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditAdministratorAd = ({ selected, onClose, onSuccess }) => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await handleGetAdminId(selected.id);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error al cargar administrador:", error);
      }
    };
    if (selected?.id) fetchAdmin();
  }, [selected]);

  if (!adminData) return null;

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "numero_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const initialData = {
    numero_cedula: adminData.numero_cedula || "",
    nombre: adminData.nombre || "",
    apellido: adminData.apellido || "",
    correo_electronico: adminData.correo_electronico || "",
    rol: adminData.rol || "",
    estado: adminData.estado || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateAdmin(selected.id, data.numero_cedula, data.nombre, data.apellido, data.correo_electronico, data.estado);
  };

  return (
    <BaseEditModal
      title={`Editar administrador: ${adminData.nombre} ${adminData.apellido}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Administrador actualizado exitosamente!"
    />
  );
};

export default EditAdministratorAd;
