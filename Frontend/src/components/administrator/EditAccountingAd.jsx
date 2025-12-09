import React, { useEffect, useState, useRef } from "react";
import { handleGetAccountingAd } from "../../controllers/administrator/getAccountingAd.controller";
import { handleUpdateAccountingAd } from "../../controllers/administrator/updateAccountingAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditAccountingAd = ({ selected, onClose, onSuccess }) => {
  const selectedIdRef = useRef(selected?.id);
  const [accountingData, setAccountingData] = useState(null);

  useEffect(() => {
    const fetchAccounting = async () => {
      try {
        const response = await handleGetAccountingAd(selectedIdRef.current);
        setAccountingData(response.data);
      } catch (error) {
        console.error("Error al cargar contador:", error);
      }
    };
    if (selectedIdRef.current) fetchAccounting();
  }, []);

  if (!accountingData) return null; // No mostrar nada mientras carga

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text", inputProps: { maxLength: 10 }  },
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "correo_electronico", label: "Correo electrónico", type: "email" },
    { name: "telefono", label: "Teléfono", type: "text", inputProps: { maxLength: 10 } },
    { name: "estado", label: "Estado", type: "select", options: estados },
  ];

  const initialData = {
    numero_de_cedula: accountingData.numero_de_cedula || "",
    nombre: accountingData.nombre || "",
    apellido: accountingData.apellido || "",
    correo_electronico: accountingData.correo_electronico || "",
    telefono: accountingData.telefono || "",
    estado: accountingData.estado || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateAccountingAd(selectedIdRef.current, data);
  };

  return (
    <BaseEditModal
      title={`Editar contador: ${accountingData.nombre} ${accountingData.apellido}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Contador actualizado exitosamente!"
    />
  );
};

export default React.memo(EditAccountingAd);
