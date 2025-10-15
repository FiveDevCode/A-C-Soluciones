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


  const [termsAccepted, setTermsAccepted] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);
  
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
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Hubo un error al registrar el técnico.");
      }
    }

  }

  console.log(fieldErrors)
  return (
    <Form onSubmit={handleSubmit}>

      <TextField 
        label="Cédula" 
        fullWidth size="medium" 
        value={idCard} 
        onChange={(e) => setIdCard(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.numero_de_cedula)}
        helperText={fieldErrors.numero_de_cedula}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      />
      <TextField 
        label="Nombre" 
        fullWidth size="medium" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.nombre)}
        helperText={fieldErrors.nombre}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      />
      <TextField 
        label="Apellidos" 
        fullWidth size="medium" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.apellido)}
        helperText={fieldErrors.apellido}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      />
      <TextField 
        label="Celular" 
        fullWidth size="medium" 
        type='number'
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.telefono)}
        helperText={fieldErrors.telefono}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      />
      <TextField 
        label="Dirrecion" 
        fullWidth size="medium" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.direccion)}
        helperText={fieldErrors.direccion}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,
          },
        }}
      />
      <TextField 
        label="Correo electrónico" 
        fullWidth size="medium" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.correo_electronico)}
        helperText={fieldErrors.correo_electronico}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      />
      <TextField 
        label="Contraseña" 
        fullWidth size="medium" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.contrasenia)}
        helperText={fieldErrors.contrasenia}
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

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
        <Button type="submit" variant="contained" disabled={!termsAccepted}>Crear cuenta</Button>
        <LinkForgot to="/iniciar-sesion">¿Ya tienes cuenta?</LinkForgot>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateCl;

