import { useState } from "react";
import { Button, TextField, Alert, Tabs, Tab, Box } from "@mui/material";
import styled from "styled-components";
import { ArrowLeft, Save, Info, Cpu, Activity } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 400px;
  }
`;

const TabPanel = styled.div`
  padding: 1.5rem 0;
  display: ${props => props.active ? 'block' : 'none'};
`;

const ClientInfoBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const EquipmentCard = styled.div`
  background: linear-gradient(to right, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #dee2e6;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1976d2;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
  }

  h4 {
    margin-top: 0;
    color: #1565c0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #dee2e6;
    margin-bottom: 1rem;
  }
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FixedClientPumpingForm = ({ clientData, technicals = [], onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Información general
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tecnico_id: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    encargado: "",
    observaciones_finales: ""
  });

  // Equipos
  const [equipos, setEquipos] = useState([
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

  // Parámetros de línea
  const [parametrosLinea, setParametrosLinea] = useState({
    voltaje_linea: "",
    corriente_linea: "",
    presion_succion: "",
    presion_descarga: "",
    observaciones: ""
  });

  const handleInputChange = (field, value) => {
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
    if (equipos.length > 1) {
      setEquipos(prev => prev.filter((_, i) => i !== index));
    } else {
      alert("Debe haber al menos un equipo");
    }
  };

  const updateParametros = (field, value) => {
    setParametrosLinea(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que hay al menos un equipo
    if (equipos.length === 0) {
      setError("Debe agregar al menos un equipo de bombeo");
      setActiveTab(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);

      const payload = {
        fecha: formData.fecha,
        cliente_id: parseInt(clientData.id),
        tecnico_id: parseInt(formData.tecnico_id),
        administrador_id: parseInt(decoded.id),
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        telefono: formData.telefono,
        encargado: formData.encargado,
        observaciones_finales: formData.observaciones_finales,
        equipos,
        parametrosLinea
      };

      await handleCreatePumpingReportAd(payload);
      
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (err) {
      console.error("Error al crear reporte:", err);
      setError(err.message || "Error al crear el reporte de bombeo");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
          Volver
        </BackButton>
        <HeaderTitle>REPORTE DE EQUIPO DE BOMBEO - CLIENTE FIJO</HeaderTitle>
      </Header>

      <Content>
        {/* Banner de información del cliente */}
        <ClientInfoBanner>
          <InfoItem>
            <InfoLabel>Cliente</InfoLabel>
            <InfoValue>{clientData?.nombre} {clientData?.apellido}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Cédula</InfoLabel>
            <InfoValue>{clientData?.numero_de_cedula}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Correo</InfoLabel>
            <InfoValue>{clientData?.correo_electronico}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Teléfono</InfoLabel>
            <InfoValue>{clientData?.telefono}</InfoValue>
          </InfoItem>
        </ClientInfoBanner>

        <form onSubmit={handleSubmit}>
          <FormCard>
            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }
                }}
              >
                <Tab 
                  icon={<Info size={20} />} 
                  iconPosition="start" 
                  label="Información General" 
                />
                <Tab 
                  icon={<Cpu size={20} />} 
                  iconPosition="start" 
                  label={`Equipos (${equipos.length})`}
                />
                <Tab 
                  icon={<Activity size={20} />} 
                  iconPosition="start" 
                  label="Parámetros de Línea" 
                />
              </Tabs>
            </Box>

            {/* Tab Panel 0: Información General */}
            <TabPanel active={activeTab === 0}>
              <TwoColumnLayout>
                <TextField
                  label="Fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  value={formData.tecnico_id}
                  onChange={(e) => handleInputChange("tecnico_id", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  SelectProps={{ native: true }}
                >
                  <option value="">Seleccione un técnico</option>
                  {technicals.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.numero_de_cedula} - {tech.nombre} {tech.apellido}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Ciudad"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange("ciudad", e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Teléfono Contacto"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Encargado"
                  value={formData.encargado}
                  onChange={(e) => handleInputChange("encargado", e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <FullWidthField>
                  <TextField
                    label="Observaciones Finales"
                    value={formData.observaciones_finales}
                    onChange={(e) => handleInputChange("observaciones_finales", e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    placeholder="Ingrese observaciones generales del reporte..."
                  />
                </FullWidthField>
              </TwoColumnLayout>
            </TabPanel>

            {/* Tab Panel 1: Equipos */}
            <TabPanel active={activeTab === 1}>
              <Button
                variant="contained"
                onClick={addEquipo}
                sx={{ mb: 2 }}
                fullWidth
              >
                + Agregar Equipo
              </Button>

              {equipos.length === 0 ? (
                <Alert severity="info">
                  No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.
                </Alert>
              ) : (
                equipos.map((equipo, index) => (
                  <EquipmentCard key={index}>
                    <h4>
                      <Cpu size={20} />
                      Equipo #{index + 1}
                    </h4>
                    <CompactGrid>
                      <TextField
                        label="Equipo"
                        value={equipo.equipo}
                        onChange={(e) => updateEquipo(index, "equipo", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Marca"
                        value={equipo.marca}
                        onChange={(e) => updateEquipo(index, "marca", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Amperaje"
                        value={equipo.amperaje}
                        onChange={(e) => updateEquipo(index, "amperaje", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Presión"
                        value={equipo.presion}
                        onChange={(e) => updateEquipo(index, "presion", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Temperatura"
                        value={equipo.temperatura}
                        onChange={(e) => updateEquipo(index, "temperatura", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Estado"
                        value={equipo.estado}
                        onChange={(e) => updateEquipo(index, "estado", e.target.value)}
                        required
                        fullWidth
                        size="small"
                      />
                    </CompactGrid>
                    <TextField
                      label="Observación"
                      value={equipo.observacion}
                      onChange={(e) => updateEquipo(index, "observacion", e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      placeholder="Observaciones específicas del equipo..."
                      sx={{ mb: 1 }}
                    />
                    {equipos.length > 1 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeEquipo(index)}
                        fullWidth
                      >
                        Eliminar Equipo
                      </Button>
                    )}
                  </EquipmentCard>
                ))
              )}
            </TabPanel>

            {/* Tab Panel 2: Parámetros de Línea */}
            <TabPanel active={activeTab === 2}>
              <TwoColumnLayout>
                <TextField
                  label="Voltaje Línea"
                  value={parametrosLinea.voltaje_linea}
                  onChange={(e) => updateParametros("voltaje_linea", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ej: 220V"
                />
                <TextField
                  label="Corriente Línea"
                  value={parametrosLinea.corriente_linea}
                  onChange={(e) => updateParametros("corriente_linea", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ej: 15A"
                />
                <TextField
                  label="Presión Succión"
                  value={parametrosLinea.presion_succion}
                  onChange={(e) => updateParametros("presion_succion", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ej: 2.5 PSI"
                />
                <TextField
                  label="Presión Descarga"
                  value={parametrosLinea.presion_descarga}
                  onChange={(e) => updateParametros("presion_descarga", e.target.value)}
                  required
                  fullWidth
                  size="small"
                  placeholder="Ej: 45 PSI"
                />
                <FullWidthField>
                  <TextField
                    label="Observaciones de Parámetros"
                    value={parametrosLinea.observaciones}
                    onChange={(e) => updateParametros("observaciones", e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    placeholder="Observaciones sobre los parámetros de línea..."
                  />
                </FullWidthField>
              </TwoColumnLayout>
            </TabPanel>
          </FormCard>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ¡Reporte de bombeo creado exitosamente! Redirigiendo...
            </Alert>
          )}

          <ButtonGroup>
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={loading}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<Save size={20} />}
              size="large"
            >
              {loading ? "Guardando..." : "Guardar Reporte"}
            </Button>
          </ButtonGroup>
        </form>
      </Content>
    </Container>
  );
};

export default FixedClientPumpingForm;
