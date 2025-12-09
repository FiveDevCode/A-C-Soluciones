import { jwtDecode } from "jwt-decode";
import { handleCreateSubmitAccountingAd } from "../../controllers/administrator/createAccountingAd.controller";
import BaseFormModal from "../common/BaseFormModal";

const FormCreateAccountingAd = ({ onClose, onSuccess }) => {
  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text", inputProps: { maxLength: 10 }, required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellido", label: "Apellido", type: "text", required: true },
    { name: "correo_electronico", label: "Correo electrónico", type: "email", required: true },
    { name: "telefono", label: "Teléfono", type: "text", inputProps: { maxLength: 10 }, required: true },
    { name: "contrasenia", label: "Contraseña", type: "password", required: true },
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
