import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, TextField, MenuItem, IconButton, Alert, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.$active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f5f5f5"};
  color: ${props => props.$active ? "white" : "#666"};
  font-weight: ${props => props.$active ? "600" : "400"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e0e0e0"};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const EquipmentCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f9f9f9;
`;

const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const FormCreatePumpingReportAd = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
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

  const [formData, setFormData] = useState({
    fecha: "",
    cliente_id: "",
    tecnico_id: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    encargado: "",
    observaciones_finales: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    "Información General",
    "Equipos de Bombeo",
    "Parámetros de Línea"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);

      await handleCreatePumpingReportAd({
        fecha: formData.fecha,
        cliente_id: parseInt(formData.cliente_id),
        tecnico_id: parseInt(formData.tecnico_id),
        administrador_id: parseInt(decoded.id),
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        telefono: formData.telefono,
        encargado: formData.encargado,
        observaciones_finales: formData.observaciones_finales,
        equipos,
        parametrosLinea
      });

      onSuccess();
    } catch (error) {
      console.error("Error al crear reporte:", error);
      setErrorMsg(error.response?.data?.message || "Error al crear el reporte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Crear Reporte de Bombeo</Title>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Header>

        <StepIndicator>
          {steps.map((step, index) => (
            <Step 
              key={index} 
              $active={currentStep === index}
              onClick={() => setCurrentStep(index)}
            >
              {step}
            </Step>
          ))}
        </StepIndicator>

        <Content>
          {currentStep === 0 && (
            <FormGrid>
              <TextField
                label="Fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Cliente"
                select
                value={formData.cliente_id}
                onChange={(e) => handleChange("cliente_id", e.target.value)}
                fullWidth
              >
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.numero_de_cedula} - {c.nombre} {c.apellido}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Técnico"
                select
                value={formData.tecnico_id}
                onChange={(e) => handleChange("tecnico_id", e.target.value)}
                fullWidth
              >
                {technicals.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.numero_de_cedula} - {t.nombre} {t.apellido}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleChange("ciudad", e.target.value)}
                fullWidth
              />
              <FullWidth>
                <TextField
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  fullWidth
                />
              </FullWidth>
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                fullWidth
              />
              <TextField
                label="Encargado"
                value={formData.encargado}
                onChange={(e) => handleChange("encargado", e.target.value)}
                fullWidth
              />
              <FullWidth>
                <TextField
                  label="Observaciones Finales"
                  value={formData.observaciones_finales}
                  onChange={(e) => handleChange("observaciones_finales", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </FullWidth>
            </FormGrid>
          )}

          {currentStep === 1 && (
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
          )}

          {currentStep === 2 && (
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
          )}

          <Collapse in={!!errorMsg}>
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          </Collapse>
        </Content>

        <Footer>
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear Reporte"}
            </Button>
          )}
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default FormCreatePumpingReportAd;
