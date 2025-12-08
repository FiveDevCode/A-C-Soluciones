import styled from 'styled-components';
import { useState } from 'react';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleCreateMaintenanceSheet } from '../../controllers/common/createMaintenanceSheet.controller';

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

const BackButton = styled(Button)`
  color: white !important;
  border-color: white !important;
`;

const FormContainer = styled.form`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const FileInputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const FileInputLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const FilePreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const InfoBox = styled.div`
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
`;

const FixedClientMaintenanceForm = ({ clientId, clientData, technicianId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    introduccion: '',
    fecha_de_mantenimiento: '',
    detalles_servicio: '',
    estado_antes: '',
    observaciones: '',
    descripcion_trabajo: '',
    materiales_utilizados: '',
    estado_final: '',
    tiempo_de_trabajo: '',
    recomendaciones: ''
  });

  const [imagenes, setImagenes] = useState({
    foto_estado_antes: null,
    foto_estado_final: null,
    foto_descripcion_trabajo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setImagenes(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await handleCreateMaintenanceSheet({
        id_cliente: clientId,
        id_tecnico: technicianId,
        id_visitas: null, // Cliente fijo no requiere visita
        ...formData,
        ...imagenes
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/reportes-clientes-fijos');
      }, 2000);
    } catch (err) {
      console.error('Error al crear ficha:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al crear la ficha de mantenimiento'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton
          variant="outlined"
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/admin/reportes-clientes-fijos')}
        >
          Volver
        </BackButton>
        <HeaderTitle>FICHA DE MANTENIMIENTO - CLIENTE FIJO</HeaderTitle>
      </Header>

      <FormContainer onSubmit={handleSubmit}>
        <InfoBox>
          <strong>Cliente:</strong> {clientData?.nombre} {clientData?.apellido}
          <br />
          <strong>Correo:</strong> {clientData?.correo_electronico}
          <br />
          <strong>Tipo:</strong> Cliente Fijo (sin visita requerida)
        </InfoBox>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ¡Ficha creada exitosamente! El reporte se ha enviado al cliente por correo.
          </Alert>
        )}

        <TwoColumnLayout>
          {/* COLUMNA IZQUIERDA */}
          <Column>
            <div>
              <SectionTitle>Información General</SectionTitle>
              <FormGrid>
                <TextField
                  label="Fecha del Mantenimiento"
                  name="fecha_de_mantenimiento"
                  type="date"
                  value={formData.fecha_de_mantenimiento}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Tiempo de Trabajo"
                  name="tiempo_de_trabajo"
                  value={formData.tiempo_de_trabajo}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  placeholder="Ej: 4 horas"
                />
              </FormGrid>

              <TextField
                label="Introducción"
                name="introduccion"
                value={formData.introduccion}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={3}
                inputProps={{ minLength: 20, maxLength: 500 }}
                helperText="Mínimo 20 caracteres, máximo 500"
                sx={{ mt: 1.5 }}
              />

              <TextField
                label="Detalles del Servicio"
                name="detalles_servicio"
                value={formData.detalles_servicio}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={4}
                inputProps={{ minLength: 10, maxLength: 2000 }}
                helperText="Mínimo 10 caracteres, máximo 2000"
                sx={{ mt: 1.5 }}
              />
            </div>

            <div>
              <SectionTitle>Estado Antes del Mantenimiento</SectionTitle>
              <TextField
                label="Estado Antes"
                name="estado_antes"
                value={formData.estado_antes}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={4}
                inputProps={{ minLength: 20, maxLength: 1000 }}
                helperText="Descripción del estado inicial del equipo (20-1000 caracteres)"
              />

              <FileInputWrapper>
                <FileInputLabel>Foto Estado Antes</FileInputLabel>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_estado_antes')}
                />
                {imagenes.foto_estado_antes && (
                  <FilePreview>Archivo: {imagenes.foto_estado_antes.name}</FilePreview>
                )}
              </FileInputWrapper>

              <TextField
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 1000 }}
                helperText="Opcional (máximo 1000 caracteres)"
              />
            </div>
          </Column>

          {/* COLUMNA DERECHA */}
          <Column>
            <div>
              <SectionTitle>Trabajo Realizado</SectionTitle>
              <TextField
                label="Descripción del Trabajo"
                name="descripcion_trabajo"
                value={formData.descripcion_trabajo}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={4}
                inputProps={{ minLength: 20, maxLength: 1000 }}
                helperText="Detalle del trabajo realizado (20-1000 caracteres)"
              />

              <FileInputWrapper>
                <FileInputLabel>Foto del Trabajo</FileInputLabel>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_descripcion_trabajo')}
                />
                {imagenes.foto_descripcion_trabajo && (
                  <FilePreview>Archivo: {imagenes.foto_descripcion_trabajo.name}</FilePreview>
                )}
              </FileInputWrapper>

              <TextField
                label="Materiales Utilizados"
                name="materiales_utilizados"
                value={formData.materiales_utilizados}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={3}
                inputProps={{ minLength: 20, maxLength: 200 }}
                helperText="Lista de materiales (20-200 caracteres)"
                sx={{ mt: 1.5 }}
              />
            </div>

            <div>
              <SectionTitle>Estado Final</SectionTitle>
              <TextField
                label="Estado Final"
                name="estado_final"
                value={formData.estado_final}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={4}
                inputProps={{ minLength: 20, maxLength: 500 }}
                helperText="Descripción del estado final del equipo (20-500 caracteres)"
              />

              <FileInputWrapper>
                <FileInputLabel>Foto Estado Final</FileInputLabel>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_estado_final')}
                />
                {imagenes.foto_estado_final && (
                  <FilePreview>Archivo: {imagenes.foto_estado_final.name}</FilePreview>
                )}
              </FileInputWrapper>

              <TextField
                label="Recomendaciones"
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 500 }}
                helperText="Opcional (máximo 500 caracteres)"
              />
            </div>
          </Column>
        </TwoColumnLayout>

        <ButtonGroup>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/reportes-clientes-fijos')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send size={20} />}
          >
            {loading ? 'Creando...' : 'Crear y Enviar Ficha'}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </Container>
  );
};

export default FixedClientMaintenanceForm;
