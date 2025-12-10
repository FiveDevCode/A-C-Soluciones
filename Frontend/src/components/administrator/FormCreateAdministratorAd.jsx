import { jwtDecode } from "jwt-decode";
import BaseFormModal from "../common/BaseFormModal";
import { handleCreateAdmin } from "../../controllers/administrator/createAdminAd.controller";

const FormCreateAdministratorAd = ({ onClose, onSuccess }) => {

  const fields = [
    { name: "numero_cedula", label: "Cédula", type: "text", inputProps: { maxLength: 10 }, required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellido", label: "Apellido", type: "text", required: true },
    { name: "telefono", label: "Teléfono", type: "text", inputProps: { maxLength: 10 } },
    { name: "correo_electronico", label: "Correo electrónico", type: "email", required: true },
    { name: "contrasenia", label: "Contraseña", type: "password", required: true },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateAdmin(
      data.numero_cedula,
      data.nombre,
      data.apellido,
      data.telefono,
      data.correo_electronico,
      data.contrasenia,
      parseInt(decoded.id)
    );
  };

  return (
    <BaseFormModal
      title="Agregar administrador"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Administrador registrado exitosamente!"
    />
  );
};

export default FormCreateAdministratorAd;
