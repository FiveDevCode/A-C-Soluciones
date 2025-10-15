import styled from 'styled-components';
import { TextField, Button, Collapse, Alert, IconButton, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { handleCreateInventory } from '../../controllers/accountant/createInventoryAc.controller';

const FormContainer = styled.form`
  max-width: 700px;
  margin: auto;
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;
  }

  & > *:nth-child(2) {
    width: 35%;
    background-color: #17A2B8;
  }
`;

export const FormCreateInventoryAd = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    categoria: '',
    cantidad_disponible: '',
    estado: 'Disponible',
    id_administrador: '',
    estado_herramienta: 'activo'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {

      await handleCreateInventory({
        ...formData,
        id_administrador: parseInt(id),
      });

      console.log({
        ...formData,
        id_administrador: parseInt(id),
      });

      setShowSuccess(true);
      setFieldErrors({});
      setErrorMsg('');

      setTimeout(() => {
        navigate(`/admin/inventario`);
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('');
      setFieldErrors({});

      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, message]) => {
          formattedErrors[field] = message;
        });
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(err.response?.data?.message || 'Error al registrar el inventario');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Campo: Nombre */}
      <TextField
        label="Nombre"
        name="nombre"
        fullWidth
        margin="normal"
        value={formData.nombre}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.nombre)}
        helperText={fieldErrors.nombre}
      />

      {/* Campo: Código */}
      <TextField
        label="Código"
        name="codigo"
        fullWidth
        margin="normal"
        value={formData.codigo}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.codigo)}
        helperText={fieldErrors.codigo}
      />

      {/* Campo: Categoría */}
      <TextField
        label="Categoría"
        name="categoria"
        fullWidth
        margin="normal"
        value={formData.categoria}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.categoria)}
        helperText={fieldErrors.categoria}
      />

      {/* Campo: Cantidad disponible */}
      <TextField
        label="Cantidad disponible"
        name="cantidad_disponible"
        type="number"
        fullWidth
        margin="normal"
        value={formData.cantidad_disponible}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.cantidad_disponible)}
        helperText={fieldErrors.cantidad_disponible}
      />

      <TextField
        select
        label="Estado"
        name="estado"
        fullWidth
        margin="normal"
        value={formData.estado}
        onChange={handleInputChange}
      >
        <MenuItem value="Disponible">Disponible</MenuItem>
        <MenuItem value="En mantenimiento">En mantenimiento</MenuItem>
        <MenuItem value="No disponible">No disponible</MenuItem>
      </TextField>

      {/* Campo: Estado herramienta */}
      <TextField
        select
        label="Estado de herramienta"
        name="estado_herramienta"
        fullWidth
        margin="normal"
        value={formData.estado_herramienta}
        onChange={handleInputChange}
      >
        <MenuItem value="activo">Activo</MenuItem>
        <MenuItem value="inactivo">Inactivo</MenuItem>
      </TextField>

      {/* Alertas */}
      <Collapse in={!!errorMsg}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setErrorMsg('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errorMsg}
        </Alert>
      </Collapse>

      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowSuccess(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          ¡Herramienta registrada exitosamente!
        </Alert>
      </Collapse>

      {/* Botones */}
      <ContainerButton>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: '1rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando herramienta...' : 'Registrar herramienta'}
        </Button>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/admin/inventario')}
        >
          Cancelar
        </Button>
      </ContainerButton>
    </FormContainer>
  );
};

export default FormCreateInventoryAd;
