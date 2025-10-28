import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleGetInventoryAd } from "../../controllers/administrator/getInventoryAd.controller";
import { handleUpdateInventoryAd } from "../../controllers/administrator/updateInventoryAd.controller";
import BaseEditModal from "../common/BaseEditModal";
import inventoryIcon from "../../assets/administrator/registerInventoryAd.png";

const EditInventoryAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [toolData, setToolData] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await handleGetInventoryAd(id);
        setToolData(response.data);
      } catch (error) {
        console.error("Error al cargar herramienta:", error);
      }
    };
    fetchTool();
  }, [id]);

  if (!toolData) return <p>Cargando datos...</p>;

  const categorias = [
    { value: "electricas", label: "Eléctricas" },
    { value: "manuales", label: "Manuales" },
    { value: "medicion", label: "Medición" },
    { value: "neumaticas", label: "Neumáticas" },
    { value: "jardineria", label: "Jardinería" },
    { value: "seguridad", label: "Seguridad" },
    { value: "otras", label: "Otras" },
  ];

  const estadosHerramienta = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "nombre", label: "Nombre de la herramienta", type: "text" },
    { name: "codigo", label: "Código", type: "text" },
    { name: "categoria", label: "Categoría", type: "select", options: categorias },
    { name: "cantidad_disponible", label: "Cantidad disponible", type: "number" },
    { name: "estado", label: "Estado", type: "text" },
    { name: "estado_herramienta", label: "Estado de la herramienta", type: "select", options: estadosHerramienta },
  ];

  const initialData = {
    nombre: toolData.nombre || "",
    codigo: toolData.codigo || "",
    categoria: toolData.categoria || "",
    cantidad_disponible: toolData.cantidad_disponible || "",
    estado: toolData.estado || "",
    estado_herramienta: toolData.estado_herramienta || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateInventoryAd(id, data);
  };

  return (
    <BaseEditModal
      title={`Editar herramienta: ${toolData.nombre}`}
      image={inventoryIcon}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={() => navigate(-1)}
      onSuccess={() => navigate(`/admin/inventario/${id}`)}
      successMessage="¡Herramienta actualizada exitosamente!"
    />
  );
};

export default EditInventoryAd;
