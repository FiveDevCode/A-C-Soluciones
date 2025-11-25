import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Alert } from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";

const FormCreatePumpingReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [parametrosLinea, setParametrosLinea] = useState({
    voltaje_linea: "",
    corriente_linea: "",
    presion_succion: "",
    presion_descarga: "",
    observaciones: ""
  });

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
          name: "cliente_id",
          label: "Cliente",
          type: "select",
          options: clients.map(c => ({
            value: c.id,
            label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
          })),
        },
        {
          name: "tecnico_id",
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
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true },
      ]
    },
    {
      title: "Equipos de Bombeo",
      fields: []
    },
    {
      title: "Parámetros de Línea",
      fields: []
    }
  ];

  const addEquipo = () => {
    setEquipos(prev => [
      ...prev,
      {
        equipo: "",
        marca: "",
        amperaje: "",
        presion: "",
        temperatura: "",
        estado: "",
        observacion: ""
      }
    ]);
  };

  const updateEquipo = (index, field, value) => {
    const copy = [...equipos];
    copy[index][field] = value;
    setEquipos(copy);
  };

  const removeEquipo = (index) => {
    setEquipos(prev => prev.filter((_, i) => i !== index));
  };

  const updateParametros = (field, value) => {
    setParametrosLinea(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = (step) => {
    if (step === 1) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addEquipo}
            sx={{ mb: 2 }}
          >
            Agregar Equipo
          </Button>

          {equipos.map((equipo, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Equipo #{index + 1}</h4>
              <FormGrid>
                <TextField
                  label="Equipo"
                  value={equipo.equipo}
                  onChange={(e) => updateEquipo(index, "equipo", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Marca"
                  value={equipo.marca}
                  onChange={(e) => updateEquipo(index, "marca", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Amperaje"
                  value={equipo.amperaje}
                  onChange={(e) => updateEquipo(index, "amperaje", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Presión"
                  value={equipo.presion}
                  onChange={(e) => updateEquipo(index, "presion", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura"
                  value={equipo.temperatura}
                  onChange={(e) => updateEquipo(index, "temperatura", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Estado"
                  value={equipo.estado}
                  onChange={(e) => updateEquipo(index, "estado", e.target.value)}
                  fullWidth
                  size="small"
                />
                <FullWidth>
                  <TextField
                    label="Observación"
                    value={equipo.observacion}
                    onChange={(e) => updateEquipo(index, "observacion", e.target.value)}
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
                onClick={() => removeEquipo(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Equipo
              </Button>
            </EquipmentCard>
          ))}

          {equipos.length === 0 && (
            <Alert severity="info">No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.</Alert>
          )}
        </>
      );
    }

    if (step === 2) {
      return (
        <FormGrid>
          <TextField
            label="Voltaje Línea"
            value={parametrosLinea.voltaje_linea}
            onChange={(e) => updateParametros("voltaje_linea", e.target.value)}
            fullWidth
          />
          <TextField
            label="Corriente Línea"
            value={parametrosLinea.corriente_linea}
            onChange={(e) => updateParametros("corriente_linea", e.target.value)}
            fullWidth
          />
          <TextField
            label="Presión Succión"
            value={parametrosLinea.presion_succion}
            onChange={(e) => updateParametros("presion_succion", e.target.value)}
            fullWidth
          />
          <TextField
            label="Presión Descarga"
            value={parametrosLinea.presion_descarga}
            onChange={(e) => updateParametros("presion_descarga", e.target.value)}
            fullWidth
          />
          <FullWidth>
            <TextField
              label="Observaciones"
              value={parametrosLinea.observaciones}
              onChange={(e) => updateParametros("observaciones", e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </FullWidth>
        </FormGrid>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreatePumpingReportAd({
      fecha: data.fecha,
      cliente_id: parseInt(data.cliente_id),
      tecnico_id: parseInt(data.tecnico_id),
      administrador_id: parseInt(decoded.id),
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      encargado: data.encargado,
      observaciones_finales: data.observaciones_finales,
      equipos,
      parametrosLinea
    });
  };

  return (
    <BaseFormModal
      title="Crear Reporte de Bombeo"
      steps={steps}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte de bombeo creado exitosamente!"
      renderStepContent={renderStepContent}
    />
  );
};

export default FormCreatePumpingReportAd;
