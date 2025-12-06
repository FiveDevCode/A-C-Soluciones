import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { administratorService } from '../../services/administrator-service';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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

const BackButton = styled(Button)`
  color: white !important;
  border-color: white !important;
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  margin: 2rem auto;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
    width: calc(100% - 2rem);
  }
`;

const FormTitle = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
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

const InfoText = styled.p`
  margin: 0;
  color: #1565c0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CreateFixedClientAd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    numero_de_cedula: '',
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    contrasenia: '',
    confirmar_contrasenia: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar cédula
    if (!formData.numero_de_cedula) {
      newErrors.numero_de_cedula = 'La cédula es requerida';
    } else if (!/^\d{6,10}$/.test(formData.numero_de_cedula)) {
      newErrors.numero_de_cedula = 'La cédula debe tener entre 6 y 10 dígitos';
    }

    // Validar nombre
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2 || formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre debe tener entre 2 y 50 caracteres';
    }

    // Validar apellido
    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length < 2 || formData.apellido.length > 50) {
      newErrors.apellido = 'El apellido debe tener entre 2 y 50 caracteres';
    }

    // Validar correo
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo no es válido';
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    // Validar dirección
    if (!formData.direccion) {
      newErrors.direccion = 'La dirección es requerida';
    } else if (formData.direccion.length < 10 || formData.direccion.length > 200) {
      newErrors.direccion = 'La dirección debe tener entre 10 y 200 caracteres';
    }

    // Validar contraseña
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es requerida';
    } else if (formData.contrasenia.length < 8) {
      newErrors.contrasenia = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (formData.contrasenia !== formData.confirmar_contrasenia) {
      newErrors.confirmar_contrasenia = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Preparar datos para enviar (sin confirmar_contrasenia)
      const { confirmar_contrasenia, ...dataToSend } = formData;
      
      await administratorService.createFixedClient(dataToSend);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/clientes');
      }, 2000);
    } catch (err) {
      console.error('Error al crear cliente fijo:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Error al crear el cliente fijo. Por favor, intenta nuevamente.'
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
          onClick={() => navigate('/admin/clientes')}
        >
          Volver
        </BackButton>
        <HeaderTitle>CREAR CLIENTE FIJO</HeaderTitle>
      </Header>

      <FormContainer>
        <FormTitle>
          <UserPlus size={20} />
          Información del Cliente Fijo
        </FormTitle>

        <InfoBox>
          <InfoText>
            <strong>Cliente Fijo:</strong> Este tipo de cliente no requiere solicitudes ni visitas programadas. 
            Los reportes de mantenimiento, fichas y reportes de bombeo se pueden enviar directamente sin necesidad de agendar una visita previa.
          </InfoText>
        </InfoBox>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Cliente fijo creado exitosamente. Redirigiendo...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <TextField
              label="Número de Cédula"
              name="numero_de_cedula"
              value={formData.numero_de_cedula}
              onChange={handleChange}
              error={!!errors.numero_de_cedula}
              helperText={errors.numero_de_cedula}
              required
              fullWidth
              inputProps={{ maxLength: 10 }}
            />

            <TextField
              label="Tipo de Cliente"
              value="Cliente Fijo"
              disabled
              fullWidth
              helperText="Este cliente no requiere visitas programadas"
              InputProps={{
                style: { backgroundColor: '#f5f5f5' }
              }}
            />

            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Correo Electrónico"
              name="correo_electronico"
              type="email"
              value={formData.correo_electronico}
              onChange={handleChange}
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico}
              required
              fullWidth
            />

            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
              required
              fullWidth
              inputProps={{ maxLength: 10 }}
            />

            <FullWidth>
              <TextField
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                error={!!errors.direccion}
                helperText={errors.direccion}
                required
                fullWidth
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
              />
            </FullWidth>

            <TextField
              label="Contraseña"
              name="contrasenia"
              type="password"
              value={formData.contrasenia}
              onChange={handleChange}
              error={!!errors.contrasenia}
              helperText={errors.contrasenia || 'Mínimo 8 caracteres'}
              required
              fullWidth
            />

            <TextField
              label="Confirmar Contraseña"
              name="confirmar_contrasenia"
              type="password"
              value={formData.confirmar_contrasenia}
              onChange={handleChange}
              error={!!errors.confirmar_contrasenia}
              helperText={errors.confirmar_contrasenia}
              required
              fullWidth
            />
          </FormGrid>

          <ButtonGroup>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/clientes')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
            >
              {loading ? 'Creando...' : 'Crear Cliente Fijo'}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default CreateFixedClientAd;
