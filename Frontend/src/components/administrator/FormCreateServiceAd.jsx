import { jwtDecode } from "jwt-decode";
import { handleCreateService } from "../../controllers/administrator/createServiceAd.controller";
import BaseFormModal from "../common/BaseFormModal";

const FormCreateServiceAd = ({ onClose, onSuccess }) => {
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

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    await handleCreateService({
      ...data,
      id_administrador: parseInt(decoded.id),
    });
  };

  return (
    <BaseFormModal
      title="Agregar servicio"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Servicio registrado exitosamente!"
    />
  );
};

export default FormCreateServiceAd;
