import { TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

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



const validacionFormulario = (texto) => {
  return texto.length > 0 ? true : false;  // en caso de que se mayor o igual a 0 la validacion sera valida;
}


const FormCreateCl = () => {
  const [name, setName] = useState({
    value: "",
    valid: null,
  });
  const [lastName, setLastName] = useState({
    value: "",
    valid: null,
  });
  const [phone, setPhone] = useState({
    value: "",
    valid: null,
  });
  const [email, setEmail] = useState({
    value: "",
    valid: null,
  });
  const [password, setPassword] = useState({
    value: "",
    valid: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);
  
  return (
    <Form>
      <TextField 
        label="Nombre" 
        fullWidth size="medium" 
        value={name.value} 
        onChange={(e) => setName({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={name.valid === false} 
        helperText={name.valid === false && "El campo no debe estar vacio"} 
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
        value={lastName.value} 
        onChange={(e) => setLastName({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={lastName.valid === false} 
        helperText={lastName.valid === false && "El campo no debe estar vacio"} 
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
        value={phone.value} 
        onChange={(e) => setPhone({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={phone.valid === false} 
        helperText={phone.valid === false && "El campo no debe estar vacio"} 
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
        value={email.value} 
        onChange={(e) => setEmail({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={email.valid === false} 
        helperText={email.valid === false && "El campo no debe estar vacio"} 
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
        value={password.value} 
        onChange={(e) => setPassword({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={password.valid === false} 
        helperText={password.valid === false && "El campo no debe estar vacio"} 
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,

          },
        }}
      /> 

      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Aceptas los <Link href="#">Términos y condiciones</Link>
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
            Quiero recibir ofertas personalizadas de A&C Soluciones. Consulta las <Link href="#">Políticas de privacidad</Link>
          </Typography>
        }
      />


      <ContainerButton>
        <Button type="submit" variant="contained" disabled={!termsAccepted}>Crear cuenta</Button>
        <LinkForgot to="/login">¿Ya tienes cuenta?</LinkForgot>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateCl;

