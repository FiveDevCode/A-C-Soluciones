import { jwtDecode } from "jwt-decode";
import { handleCreateSubmitAccountingAd } from "../../controllers/administrator/createAccountingAd.controller";
import BaseFormModal from "../common/BaseFormModal";

const FormCreateAccountingAd = ({ onClose, onSuccess }) => {
  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text" },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "contrasenia", label: "Contraseña", type: "password" },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    await handleCreateSubmitAccountingAd({
      ...data,
      id_administrador: parseInt(decoded.id),
    });
  };

  return (
    <BaseFormModal
      title="Agregar contador"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Contador registrado exitosamente!"
    />
  );
};

export default FormCreateAccountingAd;
