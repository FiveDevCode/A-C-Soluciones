import React, { useEffect, useState, useRef } from "react";
import { handleGetInventoryAd } from "../../controllers/administrator/getInventoryAd.controller";
import { handleUpdateInventoryAd } from "../../controllers/administrator/updateInventoryAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditInventoryAd = ({ selected, onClose, onSuccess }) => {
  const selectedIdRef = useRef(selected?.id);
  const [toolData, setToolData] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await handleGetInventoryAd(selectedIdRef.current);
        setToolData(response.data);
      } catch (error) {
        console.error("Error al cargar herramienta:", error);
      }
    };
    if (selectedIdRef.current) fetchTool();
  }, []);

  if (!toolData) return null; // no mostrar nada mientras carga

  const categorias = [
    { value: "electricas", label: "Eléctricas" },
    { value: "manuales", label: "Manuales" },
    { value: "medicion", label: "Medición" }
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
    await handleUpdateInventoryAd(selectedIdRef.current, data);
  };

  return (
    <BaseEditModal
      title={`Editar herramienta: ${toolData.nombre}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}   
      onSuccess={onSuccess}  
      successMessage="¡Herramienta actualizada exitosamente!"
    />
  );
};

export default React.memo(EditInventoryAd);
