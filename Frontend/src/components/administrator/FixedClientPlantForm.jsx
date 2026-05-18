import { useState, useEffect } from "react";
import { Button, TextField, Alert, Tabs, Tab, Box, Checkbox, FormControlLabel, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, FormControl, RadioGroup, Radio } from "@mui/material";
import styled from "styled-components";
import { ArrowLeft, Save, Info, Zap, CheckSquare, History, FileText, Droplet, Wrench } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import { administratorService } from "../../services/administrator-service";
import { commonService } from "../../services/common-service";
import { buildDefaultChecklist, toApiVerificaciones } from "../common/maintenanceReportChecklist";
import SignaturePadField from "../common/SignaturePadField";

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
  margin-bottom: 1rem;
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
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
  margin-top: 2rem;
`;

const AddButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #5568d3 0%, #653a8b 100%);
      box-shadow: 0 6px 8px rgba(102, 126, 234, 0.4);
    }
  }
`;

const RemoveButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    }
  }
`;

const FixedClientPlantForm = ({ clientData, technicals, onBack, tecnicoData }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [firmaTecnico, setFirmaTecnico] = useState("");
  const [firmaRecibido, setFirmaRecibido] = useState("");

  // Estados para el historial
  const [historialLoading, setHistorialLoading] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [reportesBombeo, setReportesBombeo] = useState([]);
  const [reportesMantenimiento, setReportesMantenimiento] = useState([]);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    id_tecnico: '',
    ciudad: clientData?.ciudad || '',
    direccion: clientData?.direccion || '',
    telefono: clientData?.telefono || '',
    encargado: tecnicoData?.nombre || '',
    generador: '',
    marca_generador: '',
    motor: '',
    modelo_generador: '',
    kva: '',
    serie_generador: '',
    observaciones_finales: ''
  });

  const [verificaciones, setVerificaciones] = useState(buildDefaultChecklist());

  // Cargar historial cuando se monta el componente o cambia el tab a historial
  useEffect(() => {
    if (currentTab === 5 && clientData) { // Tab 5 será el de historial
      loadHistorial();
    }
  }, [currentTab, clientData]);

  const loadHistorial = async () => {
    setHistorialLoading(true);
    try {
      // Cargar fichas
      const fichasResponse = await commonService.getListToken();
      const fichasData = fichasResponse.data.fichas || fichasResponse.data || [];
      const fichasFiltradas = fichasData.filter(f => f.cliente_id === clientData.id || f.id_cliente === clientData.id);
      setFichas(fichasFiltradas);

      // Cargar reportes de bombeo
      const bombeoResponse = await administratorService.getListPumpingReports();
      const bombeoData = bombeoResponse.data.reportes || bombeoResponse.data || [];
      const bombeoFiltrados = bombeoData.filter(r => r.cliente_id === clientData.id);
      setReportesBombeo(bombeoFiltrados);

      // Cargar reportes de mantenimiento
      const mantenimientoResponse = await administratorService.getListMaintenanceReport();
      const mantenimientoData = mantenimientoResponse.data.reportes || mantenimientoResponse.data || [];
      const mantenimientoFiltrados = mantenimientoData.filter(r => r.id_cliente === clientData.id);
      setReportesMantenimiento(mantenimientoFiltrados);

    } catch (err) {
      console.error('Error al cargar historial:', err);
    } finally {
      setHistorialLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateVerificacion = (index, field, value) => {
    const copy = [...verificaciones];
    copy[index] = {
      ...copy[index],
      [field]: value
    };
    setVerificaciones(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar firmas como en clientes normales
    if (!firmaTecnico || !firmaRecibido) {
      window.alert("Debes registrar la firma del técnico y la firma de recibido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);

      console.log('🔍 [FRONTEND] Enviando reporte con:', {
        id_cliente: clientData.id,
        id_cliente_parseado: parseInt(clientData.id),
        clientData_completo: clientData
      });

      await handleCreateMaintenanceReportAd({
        fecha: formData.fecha,
        id_cliente: parseInt(clientData.id),
        id_tecnico: parseInt(formData.id_tecnico),
        id_administrador: parseInt(decoded.id),
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        telefono: formData.telefono,
        encargado: formData.encargado,
        generador: formData.generador,
        marca_generador: formData.marca_generador,
        motor: formData.motor,
        modelo_generador: formData.modelo_generador,
        kva: formData.kva ? parseInt(formData.kva) : null,
        serie_generador: formData.serie_generador,
        observaciones_finales: formData.observaciones_finales,
        firma_tecnico: firmaTecnico,
        firma_recibido: firmaRecibido,
        parametros_operacion: [],
        verificaciones: toApiVerificaciones(verificaciones)
      });

      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      console.error('Error al crear reporte:', err);
      setError(err.response?.data?.error || 'Error al crear el reporte de mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Información General
        return (
          <>
            <TwoColumnLayout>
              <TextField
                label="Fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                select
                value={formData.id_tecnico}
                onChange={(e) => handleChange('id_tecnico', e.target.value)}
                fullWidth
                size="small"
                required
                SelectProps={{ native: true }}
              >
                <option value="">Seleccione un técnico</option>
                {technicals.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.numero_de_cedula} - {tech.nombre} {tech.apellido}
                  </option>
                ))}
              </TextField>
            </TwoColumnLayout>

            <TwoColumnLayout>
              <TextField
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleChange('ciudad', e.target.value)}
                fullWidth
                size="small"
                required
              />
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                fullWidth
                size="small"
              />
            </TwoColumnLayout>

            <FullWidthField>
              <TextField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                fullWidth
                size="small"
                required
              />
            </FullWidthField>

            <FullWidthField>
              <TextField
                label="Encargado"
                value={formData.encargado}
                onChange={(e) => handleChange('encargado', e.target.value)}
                fullWidth
                size="small"
                required
              />
            </FullWidthField>
          </>
        );

      case 1: // Información del Generador
        return (
          <TwoColumnLayout>
            <TextField
              label="Generador"
              value={formData.generador}
              onChange={(e) => handleChange('generador', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Marca"
              value={formData.marca_generador}
              onChange={(e) => handleChange('marca_generador', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Motor"
              value={formData.motor}
              onChange={(e) => handleChange('motor', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Modelo"
              value={formData.modelo_generador}
              onChange={(e) => handleChange('modelo_generador', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="KVA"
              type="number"
              value={formData.kva}
              onChange={(e) => handleChange('kva', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Serie"
              value={formData.serie_generador}
              onChange={(e) => handleChange('serie_generador', e.target.value)}
              fullWidth
              size="small"
            />
          </TwoColumnLayout>
        );

      case 2: // Verificaciones
        return (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Verificación rápida: seleccione OK o NO en cada item y agregue observación si aplica.
            </Alert>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {verificaciones.map((verif, index) => (
                <EquipmentCard key={verif.item} style={{ marginBottom: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 0.75rem 0', minHeight: '40px' }}>
                    <CheckSquare size={18} /> {index + 1}. {verif.item}
                  </h4>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <FormControl>
                      <RadioGroup
                        row
                        value={verif.estado}
                        onChange={(e) => updateVerificacion(index, "estado", e.target.value)}
                        style={{ justifyContent: 'flex-start' }}
                      >
                        <FormControlLabel value="ok" control={<Radio size="small" />} label="OK" />
                        <FormControlLabel value="no" control={<Radio size="small" />} label="NO" />
                      </RadioGroup>
                    </FormControl>

                    <TextField
                      label="Observación"
                      value={verif.observacion}
                      onChange={(e) => updateVerificacion(index, "observacion", e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Añadir novedad..."
                    />
                  </div>
                </EquipmentCard>
              ))}
            </div>
          </>
        );

      case 3: // Firmas
        return (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Debe registrar ambas firmas para generar el reporte en PDF.
            </Alert>
            <TwoColumnLayout>
              <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <SignaturePadField
                  title="Firma técnico"
                  value={firmaTecnico}
                  onChange={setFirmaTecnico}
                  required
                />
              </div>
              <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <SignaturePadField
                  title="Firma recibido"
                  value={firmaRecibido}
                  onChange={setFirmaRecibido}
                  required
                />
              </div>
            </TwoColumnLayout>
          </>
        );

      case 4: // Observaciones Finales
        return (
          <FullWidthField>
            <TextField
              label="Observaciones Finales"
              value={formData.observaciones_finales}
              onChange={(e) => handleChange('observaciones_finales', e.target.value)}
              fullWidth
              multiline
              rows={6}
              placeholder="Ingrese cualquier observación adicional sobre el mantenimiento realizado..."
            />
          </FullWidthField>
        );

      case 5: // Historial
        return (
          <div>
            {historialLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Fichas de Mantenimiento */}
                <Box mb={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Wrench size={20} color="#1976d2" />
                    <h3 style={{ margin: 0, color: '#1976d2' }}>Fichas de Mantenimiento ({fichas.length})</h3>
                  </Box>
                  {fichas.length > 0 ? (
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Dirección</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell><strong>PDF</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fichas.map((ficha) => (
                            <TableRow key={ficha.id} hover>
                              <TableCell>{new Date(ficha.fecha_visita || ficha.created_at).toLocaleDateString('es-CO')}</TableCell>
                              <TableCell>{ficha.direccion || 'N/A'}</TableCell>
                              <TableCell>
                                <Chip label={ficha.estado_maquina || 'Completado'} size="small" color="success" />
                              </TableCell>
                              <TableCell>
                                {ficha.pdf_path && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => window.open(ficha.pdf_path, '_blank')}
                                  >
                                    Ver PDF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No hay fichas de mantenimiento registradas</Alert>
                  )}
                </Box>

                {/* Reportes de Bombeo */}
                <Box mb={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Droplet size={20} color="#1976d2" />
                    <h3 style={{ margin: 0, color: '#1976d2' }}>Reportes de Bombeo ({reportesBombeo.length})</h3>
                  </Box>
                  {reportesBombeo.length > 0 ? (
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Dirección</strong></TableCell>
                            <TableCell><strong>Ciudad</strong></TableCell>
                            <TableCell><strong>Técnico</strong></TableCell>
                            <TableCell><strong>PDF</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportesBombeo.map((reporte) => (
                            <TableRow key={reporte.id} hover>
                              <TableCell>{new Date(reporte.fecha).toLocaleDateString('es-CO')}</TableCell>
                              <TableCell>{reporte.direccion}</TableCell>
                              <TableCell>{reporte.ciudad}</TableCell>
                              <TableCell>{reporte.tecnico?.nombre || 'N/A'}</TableCell>
                              <TableCell>
                                {reporte.pdf_path && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => window.open(reporte.pdf_path, '_blank')}
                                  >
                                    Ver PDF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No hay reportes de bombeo registrados</Alert>
                  )}
                </Box>

                {/* Reportes de Mantenimiento Plantas Eléctricas */}
                <Box mb={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Zap size={20} color="#1976d2" />
                    <h3 style={{ margin: 0, color: '#1976d2' }}>Reportes de Plantas Eléctricas ({reportesMantenimiento.length})</h3>
                  </Box>
                  {reportesMantenimiento.length > 0 ? (
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Fecha</strong></TableCell>
                            <TableCell><strong>Dirección</strong></TableCell>
                            <TableCell><strong>Ciudad</strong></TableCell>
                            <TableCell><strong>Marca</strong></TableCell>
                            <TableCell><strong>PDF</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportesMantenimiento.map((reporte) => (
                            <TableRow key={reporte.id} hover>
                              <TableCell>{new Date(reporte.fecha).toLocaleDateString('es-CO')}</TableCell>
                              <TableCell>{reporte.direccion}</TableCell>
                              <TableCell>{reporte.ciudad}</TableCell>
                              <TableCell>{reporte.marca_generador}</TableCell>
                              <TableCell>
                                {reporte.pdf_path && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => window.open(reporte.pdf_path, '_blank')}
                                  >
                                    Ver PDF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No hay reportes de plantas eléctricas registrados</Alert>
                  )}
                </Box>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          Volver
        </BackButton>
        <HeaderTitle>Crear Reporte de Mantenimiento - Planta Eléctrica (Cliente Fijo)</HeaderTitle>
      </Header>

      <Content>
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
            <InfoLabel>Tipo</InfoLabel>
            <InfoValue>Cliente Fijo</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Correo</InfoLabel>
            <InfoValue>{clientData?.correo_electronico}</InfoValue>
          </InfoItem>
        </ClientInfoBanner>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ¡Reporte de mantenimiento creado exitosamente! Redirigiendo...
          </Alert>
        )}

        <FormCard>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab icon={<Info size={18} />} label="General" iconPosition="start" />
              <Tab icon={<Zap size={18} />} label="Generador" iconPosition="start" />
              <Tab icon={<CheckSquare size={18} />} label="Verificaciones" iconPosition="start" />
              <Tab icon={<CheckSquare size={18} />} label="Firmas" iconPosition="start" />
              <Tab icon={<Info size={18} />} label="Observaciones" iconPosition="start" />
              <Tab icon={<History size={18} />} label="Historial" iconPosition="start" />
            </Tabs>
          </Box>

          <form onSubmit={handleSubmit}>
            <TabPanel active={currentTab === 0}>{currentTab === 0 && renderTabContent()}</TabPanel>
            <TabPanel active={currentTab === 1}>{currentTab === 1 && renderTabContent()}</TabPanel>
            <TabPanel active={currentTab === 2}>{currentTab === 2 && renderTabContent()}</TabPanel>
            <TabPanel active={currentTab === 3}>{currentTab === 3 && renderTabContent()}</TabPanel>
            <TabPanel active={currentTab === 4}>{currentTab === 4 && renderTabContent()}</TabPanel>
            <TabPanel active={currentTab === 5}>{currentTab === 5 && renderTabContent()}</TabPanel>

            {currentTab !== 5 && ( 
              <ActionButtons>
                {currentTab > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentTab(prev => prev - 1)}
                  >
                    Anterior
                  </Button>
                )}

                {currentTab < 4 ? (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(prev => prev + 1)}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={loading}
                    startIcon={<Save />}
                  >
                    {loading ? 'Guardando...' : 'Guardar Reporte'}
                  </Button>
                )}
              </ActionButtons>
            )}
          </form>
        </FormCard>
      </Content>
    </Container>
  );
};

export default FixedClientPlantForm;
