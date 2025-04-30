import { TextField, Button } from '@mui/material';
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

  & > *:first-child {
    width: 50%;

  }
  & > *:nth-child(2)  {
    width: 40%;
    background-color:#17A2B8;
  }


`


const validacionFormulario = (texto) => {
  return texto.length > 0 ? true : false;  // en caso de que se mayor o igual a 0 la validacion sera valida;
}


const FormLogin = () => {
  
  const [email, setEmail] = useState({
    value: "",
    valid: null,
  });
  const [password, setPassword] = useState({
    value: "",
    valid: null,
  });

  
  return (
    <Form>
      <TextField 
        label="Correo electrónico" 
        fullWidth size="medium" 
        value={email.value} 
        onChange={(e) => setEmail({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={email.valid === false} 
        helperText={email.valid === false && "El campo no debe estar vacio"} 
      />
      <TextField 
        label="Contraseña" 
        fullWidth size="medium" 
        value={password} 
        onChange={(e) => setPassword({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={password.valid === false} 
        helperText={password.valid === false && "El campo no debe estar vacio"} 
      />

      <LinkForgot to="/ForgotPasswordPage">Has olvidado tu contraseña?</LinkForgot>

      <ContainerButton>
        <Button type="submit" variant="contained">Iniciar sesion</Button>
        <Button type="button" variant="contained">Crear Cuenta</Button>
      </ContainerButton>

    </Form>

  )
}

export default FormLogin;
