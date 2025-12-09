import { TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleCreateSubmitClient } from '../../controllers/client/createCl.controller';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 35%;
  max-width: 500px;
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

  & > *:first-child {
    width: 50%;

  }
  & > *:nth-child(2)  {
    width: 40%;
    align-self: center;
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
        if (!value) {
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
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();

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
        setErrorMsg("Hubo un error al registrar el técnico.");
      }
    }

  }

  return (
    <Form onSubmit={handleSubmit}>

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
      <TextField 
        label="Dirrecion" 
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

      {errorMsg && (
        <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
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

