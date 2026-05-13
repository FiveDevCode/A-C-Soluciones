import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, TextField, Alert, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";
import { technicalService } from "../../services/techical-service";

const FormCreatePumpingReportTc = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [tecnicoId, setTecnicoId] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [tipoCliente, setTipoCliente] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [parametrosLinea, setParametrosLinea] = useState({
    tanque_marca: "",
    tanque_carga_determinada: "",
    tanque_carga_media: "",
    controlador_marca: ""
  });

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

  useEffect(() => {
    const fetchVisitas = async () => {
      if (selectedClienteId && tipoCliente === 'regular') {
        try {
          console.log('🔍 Obteniendo visitas para cliente ID:', selectedClienteId);
          const response = await technicalService.getListVisits();
          console.log('📋 Respuesta completa:', response.data);
          const visitasArray = response.data.data || [];
          console.log('📊 Total de visitas del técnico:', visitasArray.length);
          const visitasCliente = visitasArray.filter(v => v.solicitud_asociada?.cliente_id_fk === selectedClienteId);
          console.log('✅ Visitas filtradas para cliente:', visitasCliente.length, visitasCliente);
          setVisitas(visitasCliente);
        } catch (error) {
          console.error('❌ Error al obtener visitas:', error);
          setVisitas([]);
        }
      } else {
        setVisitas([]);
      }
    };

    fetchVisitas();
  }, [selectedClienteId, tipoCliente]);

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
        ...(tipoCliente === 'regular' ? [{
          name: "visita_id",
          label: "Visita Asociada *",
          type: "select",
          required: true,
          options: visitas.length > 0 
            ? visitas.map(v => ({
                value: v.id,
                label: `Visita #${v.id} - ${new Date(v.fecha_programada).toLocaleDateString()} - ${v.estado}`,
              }))
            : [{ value: '', label: 'No hay visitas disponibles para este cliente' }],
        }] : []),
        { name: "ciudad", label: "Ciudad", type: "text" },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true },
        { name: "telefono", label: "Teléfono", type: "text" },
        // { name: "encargado", label: "Encargado", type: "text" },
      ]
    },
    {
      title: "Equipos de Bombeo",
      fields: []
    },
    {
      title: "Parámetros de Línea",
      fields: [
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true },
      ]
    }
  ];

  const addEquipo = () => {
    setEquipos(prev => [
      ...prev,
      {
        sumergibles_medida: "",
        sumergibles_placa: "",
        amperaje_medida: "",
        amperaje_placa: "",
        amperaje_estado: "Normal",
        ruidos: "Normal",
        humedad: "No",
        conexiones: "Normal",
        presion: "",
        temperatura: ""
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
    if (step === 0) {
      return (
        <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
          Este reporte se asignará automáticamente a tu cuenta de técnico.
        </Alert>
      );
    }

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
                  label="Sumergibles Medida"
                  value={equipo.sumergibles_medida}
                  onChange={(e) => updateEquipo(index, "sumergibles_medida", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Sumergibles Placa"
                  value={equipo.sumergibles_placa}
                  onChange={(e) => updateEquipo(index, "sumergibles_placa", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Amperaje Medida"
                  value={equipo.amperaje_medida}
                  onChange={(e) => updateEquipo(index, "amperaje_medida", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Amperaje Placa"
                  value={equipo.amperaje_placa}
                  onChange={(e) => updateEquipo(index, "amperaje_placa", e.target.value)}
                  fullWidth
                  size="small"
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Estado Amperaje</FormLabel>
                  <RadioGroup
                    row
                    value={equipo.amperaje_estado}
                    onChange={(e) => updateEquipo(index, "amperaje_estado", e.target.value)}
                  >
                    <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
                    <FormControlLabel value="Recalentada" control={<Radio size="small" />} label="Recalentada" />
                  </RadioGroup>
                </FormControl>
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
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Ruidos</FormLabel>
                  <RadioGroup
                    row
                    value={equipo.ruidos}
                    onChange={(e) => updateEquipo(index, "ruidos", e.target.value)}
                  >
                    <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
                    <FormControlLabel value="Fallas" control={<Radio size="small" />} label="Fallas" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Humedad</FormLabel>
                  <RadioGroup
                    row
                    value={equipo.humedad}
                    onChange={(e) => updateEquipo(index, "humedad", e.target.value)}
                  >
                    <FormControlLabel value="Si" control={<Radio size="small" />} label="Si" />
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Conexiones Eléctricas</FormLabel>
                  <RadioGroup
                    row
                    value={equipo.conexiones}
                    onChange={(e) => updateEquipo(index, "conexiones", e.target.value)}
                  >
                    <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
                    <FormControlLabel value="Fallas" control={<Radio size="small" />} label="Fallas" />
                  </RadioGroup>
                </FormControl>
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
            label="Tanque Marca"
            value={parametrosLinea.tanque_marca}
            onChange={(e) => updateParametros("tanque_marca", e.target.value)}
            fullWidth
          />
          <TextField
            label="Tanque Carga Determinada"
            value={parametrosLinea.tanque_carga_determinada}
            onChange={(e) => updateParametros("tanque_carga_determinada", e.target.value)}
            fullWidth
          />
          <TextField
            label="Tanque Carga Media"
            value={parametrosLinea.tanque_carga_media}
            onChange={(e) => updateParametros("tanque_carga_media", e.target.value)}
            fullWidth
          />
          <TextField
            label="Controlador Marca"
            value={parametrosLinea.controlador_marca}
            onChange={(e) => updateParametros("controlador_marca", e.target.value)}
            fullWidth
          />
        </FormGrid>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
    if (!tecnicoId) {
      alert("Error: No se pudo obtener el ID del técnico autenticado");
      return;
    }

    const reportData = {
      fecha: data.fecha,
      cliente_id: parseInt(data.cliente_id),
      tecnico_id: parseInt(tecnicoId), // Usar el ID del técnico autenticado
      administrador_id: null, // Los técnicos no tienen administrador asociado
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      encargado: data.encargado,
      observaciones_finales: data.observaciones_finales,
      equipos,
      parametrosLinea
    };

    // Agregar visita_id solo si es cliente regular
    if (tipoCliente === 'regular' && data.visita_id) {
      reportData.visita_id = parseInt(data.visita_id);
    }

    await handleCreatePumpingReportAd(reportData);
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
      onFormDataChange={(data) => {
        if (data.cliente_id && data.cliente_id !== selectedClienteId) {
          const cliente = clients.find(c => c.id === parseInt(data.cliente_id));
          setSelectedClienteId(parseInt(data.cliente_id));
          setTipoCliente(cliente?.tipo_cliente || null);
        }
      }}
    />
  );
};

export default FormCreatePumpingReportTc;

