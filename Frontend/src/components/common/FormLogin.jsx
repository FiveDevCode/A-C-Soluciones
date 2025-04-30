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


const FormLogin = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  return (
    <Form>
      <TextField 
        label="Correo electrónico" 
        fullWidth size="medium" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Contraseña" 
        fullWidth size="medium" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        sx={{ backgroundColor: 'white' }}
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
