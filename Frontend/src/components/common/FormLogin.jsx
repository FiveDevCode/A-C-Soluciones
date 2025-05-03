import { TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleLogin } from '../../controllers/common/login.controller';
import { jwtDecode } from 'jwt-decode';

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
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const {data} = await handleLogin(
        email,
        password
      );

      console.log(data)
      localStorage.setItem('authToken', data.token);

      const decoded = jwtDecode(data.token);
      const role = decoded.rol;
      
      switch (role) {
        case "cliente":
          navigate("/home");
          break;
        case "tecnico":
          navigate("/homeTc");
          break;
        case "administrador":
          navigate("/homeAd");
          break;
        default:
          navigate("/login"); // o una página de error
      }

    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Hubo un error al iniciar sesion.");
      }
    }

  }


  
  return (
    <Form onSubmit={handleSubmit}>
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

      <LinkForgot to="/ForgotPasswordPage">Has olvidado tu contraseña?</LinkForgot>

      <ContainerButton>
        <Button type="submit" variant="contained">Iniciar sesion</Button>
        <Button type="button" variant="contained">Crear Cuenta</Button>
      </ContainerButton>

    </Form>

  )
}

export default FormLogin;
