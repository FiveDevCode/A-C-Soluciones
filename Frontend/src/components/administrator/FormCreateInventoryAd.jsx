import { jwtDecode } from "jwt-decode";
import { handleCreateInventory } from "../../controllers/accountant/createInventoryAc.controller";
import BaseFormModal from "../common/BaseFormModal";

const FormCreateInventory = ({ onClose, onSuccess }) => {
  const categorias = [
    { value: "electricas", label: "Eléctricas" },
    { value: "manuales", label: "Manuales" },
    { value: "medicion", label: "Medición" },
  ];
  const estados = [
    { value: "Nueva", label: "Nueva" },
    { value: "Dañada", label: "Dañada" },
    { value: "En mantenimiento", label: "En mantenimiento" },
  ];

  const fields = [
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "codigo", label: "Código", type: "text" },
    { name: "categoria", label: "Categoría", type: "select", options: categorias },
    { name: "cantidad_disponible", label: "Cantidad", type: "number" },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    await handleCreateInventory({
      ...data,
      id_administrador: parseInt(decoded.id),
    });
  };

  return (
    <BaseFormModal
      title="Agregar herramienta"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Herramienta registrada exitosamente!"
    />
  );
};

export default FormCreateInventory;
