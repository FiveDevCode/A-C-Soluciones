import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Alert, Checkbox, FormControlLabel } from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [parametrosOperacion, setParametrosOperacion] = useState([]);
  const [verificaciones, setVerificaciones] = useState([]);

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
        {
          name: "id_tecnico",
          label: "Técnico",
          type: "select",
          options: technicals.map(t => ({
            value: t.id,
            label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
          })),
        },
        { name: "ciudad", label: "Ciudad", type: "text" },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true },
        { name: "telefono", label: "Teléfono", type: "text" },
        { name: "encargado", label: "Encargado", type: "text" },
      ]
    },
    {
      title: "Información del Generador",
      fields: [
        { name: "marca_generador", label: "Marca del Generador", type: "text" },
        { name: "modelo_generador", label: "Modelo del Generador", type: "text" },
        { name: "kva", label: "KVA", type: "number" },
        { name: "serie_generador", label: "Serie del Generador", type: "text" },
      ]
    },
    {
      title: "Parámetros de Operación",
      fields: []
    },
    {
      title: "Verificaciones",
      fields: []
    },
    {
      title: "Observaciones Finales",
      fields: [
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true },
      ]
    }
  ];

  const addParametro = () => {
    setParametrosOperacion(prev => [
      ...prev,
      {
        presion_aceite: "",
        temperatura_aceite: "",
        temperatura_refrigerante: "",
        fugas_aceite: false,
        fugas_combustible: false,
        frecuencia_rpm: "",
        voltaje_salida: ""
      }
    ]);
  };

  const updateParametro = (index, field, value) => {
    const copy = [...parametrosOperacion];
    copy[index][field] = value;
    setParametrosOperacion(copy);
  };

  const removeParametro = (index) => {
    setParametrosOperacion(prev => prev.filter((_, i) => i !== index));
  };

  const addVerificacion = () => {
    setVerificaciones(prev => [
      ...prev,
      {
        item: "",
        visto: false,
        observacion: ""
      }
    ]);
  };

  const updateVerificacion = (index, field, value) => {
    const copy = [...verificaciones];
    copy[index][field] = value;
    setVerificaciones(copy);
  };

  const removeVerificacion = (index) => {
    setVerificaciones(prev => prev.filter((_, i) => i !== index));
  };

  const renderStepContent = (step) => {
    if (step === 2) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addParametro}
            sx={{ mb: 2 }}
          >
            Agregar Parámetro
          </Button>

          {parametrosOperacion.map((param, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Parámetro #{index + 1}</h4>
              <FormGrid>
                <TextField
                  label="Presión de Aceite"
                  value={param.presion_aceite}
                  onChange={(e) => updateParametro(index, "presion_aceite", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura de Aceite"
                  value={param.temperatura_aceite}
                  onChange={(e) => updateParametro(index, "temperatura_aceite", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura de Refrigerante"
                  value={param.temperatura_refrigerante}
                  onChange={(e) => updateParametro(index, "temperatura_refrigerante", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Frecuencia/RPM"
                  value={param.frecuencia_rpm}
                  onChange={(e) => updateParametro(index, "frecuencia_rpm", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Voltaje de Salida"
                  value={param.voltaje_salida}
                  onChange={(e) => updateParametro(index, "voltaje_salida", e.target.value)}
                  fullWidth
                  size="small"
                />
                <FullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.fugas_aceite}
                        onChange={(e) => updateParametro(index, "fugas_aceite", e.target.checked)}
                      />
                    }
                    label="Fugas de Aceite"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.fugas_combustible}
                        onChange={(e) => updateParametro(index, "fugas_combustible", e.target.checked)}
                      />
                    }
                    label="Fugas de Combustible"
                  />
                </FullWidth>
              </FormGrid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeParametro(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Parámetro
              </Button>
            </EquipmentCard>
          ))}

          {parametrosOperacion.length === 0 && (
            <Alert severity="info">No hay parámetros agregados. Haz clic en "Agregar Parámetro" para comenzar.</Alert>
          )}
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addVerificacion}
            sx={{ mb: 2 }}
          >
            Agregar Verificación
          </Button>

          {verificaciones.map((verif, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Verificación #{index + 1}</h4>
              <FormGrid>
                <FullWidth>
                  <TextField
                    label="Item"
                    value={verif.item}
                    onChange={(e) => updateVerificacion(index, "item", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </FullWidth>
                <FullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={verif.visto}
                        onChange={(e) => updateVerificacion(index, "visto", e.target.checked)}
                      />
                    }
                    label="Verificado"
                  />
                </FullWidth>
                <FullWidth>
                  <TextField
                    label="Observación"
                    value={verif.observacion}
                    onChange={(e) => updateVerificacion(index, "observacion", e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                  />
                </FullWidth>
              </FormGrid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeVerificacion(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Verificación
              </Button>
            </EquipmentCard>
          ))}

          {verificaciones.length === 0 && (
            <Alert severity="info">No hay verificaciones agregadas. Haz clic en "Agregar Verificación" para comenzar.</Alert>
          )}
        </>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
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
      marca_generador: data.marca_generador,
      modelo_generador: data.modelo_generador,
      kva: parseInt(data.kva) || null,
      serie_generador: data.serie_generador,
      observaciones_finales: data.observaciones_finales,
      parametros_operacion: parametrosOperacion,
      verificaciones
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

