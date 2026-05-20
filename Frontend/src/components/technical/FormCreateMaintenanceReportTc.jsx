import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import {
  buildDefaultChecklist,
  toApiVerificaciones
} from "../common/maintenanceReportChecklist";
import SignaturePadField from "../common/SignaturePadField";

const FormCreateMaintenanceReportTc = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [tecnicoId, setTecnicoId] = useState(null);
  const [checklist, setChecklist] = useState(buildDefaultChecklist());
  const [firmaTecnico, setFirmaTecnico] = useState("");
  const [firmaRecibido, setFirmaRecibido] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const clientsResponse = await handleGetListClient();
      setClients(clientsResponse || []);

      // Obtener el ID del técnico autenticado del token
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setTecnicoId(decoded.id);
        } catch (error) {
          console.error("Error decodificando token:", error);
        }
      }
    };

    fetchData();
  }, []);

  const steps = [
    {
      title: "Información General",
      fields: [
        { name: "fecha", label: "Fecha", type: "date" },
        {
          name: "id_cliente",
          label: "Cliente",
          type: "select",
          options: clients.map(c => ({
            value: c.id,
            label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
          })),
        },
        { name: "ciudad", label: "Ciudad", type: "text" },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true },
        { name: "telefono", label: "Teléfono", type: "text" },
        { name: "encargado", label: "Encargado(a)", type: "text" },
      ]
    },
    {
      title: "Información del Generador",
      fields: [
        { name: "generador", label: "Generador", type: "text" },
        { name: "marca_generador", label: "Marca", type: "text" },
        { name: "kva", label: "KVA", type: "number" },
        { name: "motor", label: "Motor", type: "text" },
        { name: "modelo_generador", label: "Modelo", type: "text" },
        { name: "serie_generador", label: "Serie", type: "text" },
      ]
    },
    {
      title: "Verificaciones",
      fields: []
    },
    {
      title: "Firmas y Observaciones",
      fields: [
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true },
      ]
    }
  ];

  const updateChecklist = (index, field, value) => {
    setChecklist((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  const renderStepContent = (step) => {
    if (step === 0) {
      return (
        <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
          Este reporte se asignará automáticamente a tu cuenta de técnico.
        </Alert>
      );
    }

    if (step === 2) {
      return (
        <Box key="step-2-verifications">
          <Alert severity="info" sx={{ mb: 2 }}>
            Marque cada verificación como OK o NO. Si aplica, agregue observación corta.
          </Alert>

          {checklist.map((item, index) => (
            <EquipmentCard key={item.item}>
              <FormGrid>
                <FullWidth>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {index + 1}. {item.item}
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      row
                      value={item.estado}
                      onChange={(e) => updateChecklist(index, "estado", e.target.value)}
                    >
                      <FormControlLabel value="ok" control={<Radio size="small" />} label="OK" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="NO" />
                    </RadioGroup>
                  </FormControl>
                </FullWidth>
                <FullWidth>
                  <TextField
                    label="Observación"
                    value={item.observacion}
                    onChange={(e) => updateChecklist(index, "observacion", e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                  />
                </FullWidth>
              </FormGrid>
            </EquipmentCard>
          ))}
        </Box>
      );
    }

    if (step === 3) {
      return (
        <Box key="step-3-signatures">
          <Alert severity="warning" sx={{ mb: 2 }}>
            Debe registrar ambas firmas para generar el reporte en PDF.
          </Alert>
          <SignaturePadField
            title="Firma técnico"
            value={firmaTecnico}
            onChange={setFirmaTecnico}
            required
          />
          <SignaturePadField
            title="Firma recibido"
            value={firmaRecibido}
            onChange={setFirmaRecibido}
            required
          />
        </Box>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
    if (!tecnicoId) {
      alert("Error: No se pudo obtener el ID del técnico autenticado");
      return;
    }

    if (!firmaTecnico || !firmaRecibido) {
      window.alert("Debes registrar la firma del técnico y la firma de recibido.");
      return;
    }

    await handleCreateMaintenanceReportAd({
      fecha: data.fecha,
      id_cliente: parseInt(data.id_cliente),
      id_tecnico: parseInt(tecnicoId), // Usar el ID del técnico autenticado
      id_administrador: null, // Los técnicos no tienen administrador asociado
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      encargado: data.encargado,
      generador: data.generador,
      marca_generador: data.marca_generador,
      motor: data.motor,
      modelo_generador: data.modelo_generador,
      kva: data.kva !== undefined && data.kva !== null && data.kva !== '' ? parseInt(data.kva, 10) : null,
      serie_generador: data.serie_generador,
      observaciones_finales: data.observaciones_finales,
      firma_tecnico: firmaTecnico,
      firma_recibido: firmaRecibido,
      parametros_operacion: [],
      verificaciones: toApiVerificaciones(checklist)
    });
  };

  return (
    <BaseFormModal
      title="Crear Reporte de Mantenimiento"
      steps={steps}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte de mantenimiento creado exitosamente!"
      renderStepContent={renderStepContent}
    />
  );
};

export default FormCreateMaintenanceReportTc;

