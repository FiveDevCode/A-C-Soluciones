import { jwtDecode } from "jwt-decode";
import { handleCreateSubmitTechnical } from "../../controllers/administrator/createTc.controller";
import BaseFormModal from "../common/BaseFormModal";

const FormCreateTechnicalAd = ({ onClose, onSuccess }) => {

  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "contrasenia", label: "Contraseña", type: "password" },
    { name: "especialidad", label: "Especialidad", type: "text"},
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateSubmitTechnical(
      data.numero_de_cedula,
      data.nombre,
      data.apellido,
      data.correo_electronico,
      data.telefono,
      data.contrasenia,
      data.especialidad,
      parseInt(decoded.id)
    );
  };

  return (
    <BaseFormModal
      title="Agregar técnico"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Técnico registrado exitosamente!"
    />
  );
};

export default FormCreateTechnicalAd;
