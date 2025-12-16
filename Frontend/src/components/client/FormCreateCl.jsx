import { TextField, Button, Checkbox, FormControlLabel, Typography, Grid, Box } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleCreateSubmitClient } from '../../controllers/client/createCl.controller';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 60%;
  max-width: 800px;
  min-width: 600px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 90%;
    min-width: auto;
    padding: 1.5rem;
  }
`
const LinkForgot = styled(Link)`
  align-self: flex-end;
  color: #0000EE;
  text-decoration: underline;
  font-size: 1.05rem;

`


const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;

  & > *:first-child {
    width: 48%;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }
  
  & > *:nth-child(2)  {
    width: auto;
    align-self: center;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    
    & > *:first-child {
      width: 100%;
    }
  }
`




const FormCreateCl = () => {

  const navigate = useNavigate();

  const [idCard, setIdCard] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});


  const [termsAccepted, setTermsAccepted] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);

  // Validaciones
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case 'idCard':
        if (!value.trim()) {
          errors.idCard = 'La cédula es requerida';
        } else if (!/^\d+$/.test(value)) {
          errors.idCard = 'La cédula solo debe contener números';
        } else if (value.length < 6 || value.length > 10) {
          errors.idCard = 'La cédula debe tener entre 6 y 10 dígitos';
        } else {
          delete errors.idCard;
        }
        break;

      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es requerido';
        } else if (value.trim() !== value) {
          errors.name = 'El nombre no debe tener espacios al inicio o final';
        } else if (/\s{2,}/.test(value)) {
          errors.name = 'El nombre no debe tener espacios múltiples';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.name = 'El nombre solo debe contener letras';
        } else if (value.length < 2) {
          errors.name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete errors.name;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'El apellido es requerido';
        } else if (value.trim() !== value) {
          errors.lastName = 'El apellido no debe tener espacios al inicio o final';
        } else if (/\s{2,}/.test(value)) {
          errors.lastName = 'El apellido no debe tener espacios múltiples';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.lastName = 'El apellido solo debe contener letras';
        } else if (value.length < 2) {
          errors.lastName = 'El apellido debe tener al menos 2 caracteres';
        } else {
          delete errors.lastName;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          errors.phone = 'El teléfono es requerido';
        } else if (!/^\d+$/.test(value)) {
          errors.phone = 'El teléfono solo debe contener números';
        } else if (value.length !== 10) {
          errors.phone = 'El teléfono debe tener 10 dígitos';
        } else {
          delete errors.phone;
        }
        break;

      case 'email':
        if (!value.trim()) {
          errors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'El correo electrónico no es válido';
        } else {
          delete errors.email;
        }
        break;

      case 'address':
        if (!value.trim()) {
          errors.address = 'La dirección es requerida';
        } else if (value.trim() !== value) {
          errors.address = 'La dirección no debe tener espacios al inicio o final';
        } else if (value.length < 5) {
          errors.address = 'La dirección debe tener al menos 5 caracteres';
        } else {
          delete errors.address;
        }
        break;

      case 'password':
        if (!value.trim()) {
          errors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          errors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else if (!/(?=.*[a-z])/.test(value)) {
          errors.password = 'La contraseña debe contener al menos una letra minúscula';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          errors.password = 'La contraseña debe contener al menos una letra mayúscula';
        } else if (!/(?=.*\d)/.test(value)) {
          errors.password = 'La contraseña debe contener al menos un número';
        } else {
          delete errors.password;
        }
        // Validar confirmación si ya se ingresó
        if (confirmPassword && value !== confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        } else if (confirmPassword && value === confirmPassword) {
          delete errors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value.trim()) {
          errors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (value !== password) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete errors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan antes de enviar
    if (password !== confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
      setErrorMsg("Por favor, asegúrate de que las contraseñas coincidan.");
      return;
    }

    // Validar que no haya errores de validación
    if (Object.keys(validationErrors).length > 0) {
      setErrorMsg("Por favor, corrige los errores antes de continuar.");
      return;
    }

    try {
      await handleCreateSubmitClient(
        idCard,
        name,
        lastName,
        email,
        phone,
        password,
        address
      );

      navigate("/iniciar-sesion");
      setErrorMsg("");
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Hubo un error al registrar el cliente.");
      }
    }

  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Cédula" 
            fullWidth size="medium" 
            value={idCard} 
            onChange={(e) => {
              setIdCard(e.target.value);
              validateField('idCard', e.target.value);
            }}
            onBlur={(e) => validateField('idCard', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.idCard || fieldErrors.numero_de_cedula)}
            helperText={validationErrors.idCard || fieldErrors.numero_de_cedula}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Nombre" 
            fullWidth size="medium" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value);
              validateField('name', e.target.value);
            }}
            onBlur={(e) => validateField('name', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.name || fieldErrors.nombre)}
            helperText={validationErrors.name || fieldErrors.nombre}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Apellidos" 
            fullWidth size="medium" 
            value={lastName} 
            onChange={(e) => {
              setLastName(e.target.value);
              validateField('lastName', e.target.value);
            }}
            onBlur={(e) => validateField('lastName', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.lastName || fieldErrors.apellido)}
            helperText={validationErrors.lastName || fieldErrors.apellido}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Celular" 
            fullWidth size="medium" 
            type='number'
            value={phone} 
            onChange={(e) => {
              setPhone(e.target.value);
              validateField('phone', e.target.value);
            }}
            onBlur={(e) => validateField('phone', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.phone || fieldErrors.telefono)}
            helperText={validationErrors.phone || fieldErrors.telefono}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Dirección" 
            fullWidth size="medium" 
            value={address} 
            onChange={(e) => {
              setAddress(e.target.value);
              validateField('address', e.target.value);
            }}
            onBlur={(e) => validateField('address', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.address || fieldErrors.direccion)}
            helperText={validationErrors.address || fieldErrors.direccion}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Correo electrónico" 
            fullWidth size="medium" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            onBlur={(e) => validateField('email', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.email || fieldErrors.correo_electronico)}
            helperText={validationErrors.email || fieldErrors.correo_electronico}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Contraseña" 
            fullWidth size="medium" 
            type="password"
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              validateField('password', e.target.value);
            }}
            onBlur={(e) => validateField('password', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.password || fieldErrors.contrasenia)}
            helperText={validationErrors.password || fieldErrors.contrasenia}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Confirmar contraseña" 
            fullWidth size="medium" 
            type="password"
            value={confirmPassword} 
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateField('confirmPassword', e.target.value);
            }}
            onBlur={(e) => validateField('confirmPassword', e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(validationErrors.confirmPassword)}
            helperText={validationErrors.confirmPassword}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                color: 'error.main',
              },
            }}
          />
        </Grid>
      </Grid>

      {errorMsg && (
        <Typography 
          color="error" 
          sx={{ 
            backgroundColor: '#ffebee', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #ef5350',
            marginTop: '0.5rem'
          }}
        >
          {errorMsg}
        </Typography>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Aceptas los <Link to="/terminos-y-condiciones">Términos y condiciones</Link>
          </Typography>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={offersAccepted}
            onChange={(e) => setOffersAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Quiero recibir ofertas personalizadas de A&C Soluciones. Consulta las <Link to="/politicas-de-privacidad">Políticas de privacidad</Link>
          </Typography>
        }
      />


      <ContainerButton>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={
            !termsAccepted || 
            Object.keys(validationErrors).length > 0 ||
            !idCard || !name || !lastName || !phone || !email || !address || !password
          }
        >
          Crear cuenta
        </Button>
        <LinkForgot to="/iniciar-sesion">¿Ya tienes cuenta?</LinkForgot>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateCl;

