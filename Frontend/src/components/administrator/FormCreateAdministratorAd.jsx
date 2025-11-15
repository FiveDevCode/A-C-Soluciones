import { jwtDecode } from "jwt-decode";
import BaseFormModal from "../common/BaseFormModal";
import { handleCreateAdmin } from "../../controllers/administrator/createAdminAd.controller";

const FormCreateAdministratorAd = ({ onClose, onSuccess }) => {
  const roles = [
    { value: "Administrador", label: "Administrador" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Asistente", label: "Asistente" },
  ];

  const estados = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "numero_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "contrasenia", label: "Contraseña", type: "password" },
    { name: "rol", label: "Rol", type: "select", options: roles },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateAdmin(
      data.numero_cedula,
      data.nombre,
      data.apellido,
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
