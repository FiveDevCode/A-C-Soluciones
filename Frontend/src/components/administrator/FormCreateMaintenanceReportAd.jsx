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
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import {
  buildDefaultChecklist,
  toApiVerificaciones
} from "../common/maintenanceReportChecklist";
import SignaturePadField from "../common/SignaturePadField";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [checklist, setChecklist] = useState(buildDefaultChecklist());
  const [firmaTecnico, setFirmaTecnico] = useState("");
  const [firmaRecibido, setFirmaRecibido] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const clientsResponse = await handleGetListClient();
      setClients(clientsResponse || []);

      const technicalResponse = await handleGetListTechnical();
      setTechnicals(technicalResponse.data || []);
    };

    fetchData();
  }, []);

  const steps = [
    {
      title: "Información General",
      fields: [
        { name: "fecha", label: "Fecha", type: "date", required: true },
        {
          name: "id_cliente",
          label: "Cliente",
          type: "autocomplete",
          options: clients.map((c) => ({
            value: c.id,
            label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
          })),
          required: true
        },
        {
          name: "id_tecnico",
          label: "Técnico",
          type: "autocomplete",
          options: technicals.map((t) => ({
            value: t.id,
            label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
          })),
          required: true
        },
        { name: "ciudad", label: "Ciudad", type: "text", required: true },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true, required: true },
        { name: "telefono", label: "Teléfono", type: "text", required: false },
        { name: "encargado", label: "Encargado(a)", type: "text", required: false },
      ]
    },
    {
      title: "Información del Generador",
      fields: [
        { name: "generador", label: "Generador", type: "text", required: false },
        { name: "marca_generador", label: "Marca", type: "text", required: true },
        { name: "kva", label: "KVA", type: "number", required: false },
        { name: "motor", label: "Motor", type: "text", required: false },
        { name: "modelo_generador", label: "Modelo", type: "text", required: true },
        { name: "serie_generador", label: "Serie", type: "text", required: false },
      ]
    },
    {
      title: "Verificaciones",
      fields: []
    },
    {
      title: "Firmas",
      fields: []
    },
    {
      title: "Observaciones Finales",
      fields: [
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true, required: false },
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

    if (step !== 2) {
      return null;
    }

    return (
      <Box key="step-2-verifications">
        <Alert severity="info" sx={{ mb: 2 }}>
          Este reporte usa una lista fija de verificación. Solo marque OK o NO y agregue observación cuando aplique.
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
  };

  const handleSubmit = async (data) => {
    if (!firmaTecnico || !firmaRecibido) {
      window.alert("Debes registrar la firma del técnico y la firma de recibido.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateMaintenanceReportAd({
      fecha: data.fecha,
      id_cliente: parseInt(data.id_cliente),
      id_tecnico: parseInt(data.id_tecnico),
      id_administrador: parseInt(decoded.id),
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

export default FormCreateMaintenanceReportAd;
