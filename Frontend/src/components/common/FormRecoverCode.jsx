import { TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
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
  align-self: center;
  color: #0000EE;
  text-decoration: underline;
  font-size: 1rem;
  margin-top: 1rem;

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


const FormRecoverCode = () => {
  
  const navigate = useNavigate();

  const [code, setCode] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
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
            break;
        }
      } catch (error) {
        console.error("Token inválido:", error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userRole');
      }
    }
  }, []);



  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const {data} = await handleLogin(
        email,
        password
      );

      console.log(data)
      sessionStorage.setItem('authToken', data.token);

      const decoded = jwtDecode(data.token);
      const role = decoded.rol;
      sessionStorage.setItem('userRole', role);

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
        setErrorMsg("Correo o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.");
      }
    }

  }


  
  return (
    <Form onSubmit={handleSubmit}>
      <TextField 
        label="Código" 
        fullWidth size="medium" 
        value={code} 
        type='number'
        onChange={(e) => setCode(e.target.value)}
        sx={{ 
          backgroundColor: 'white',
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
        }}
        error={Boolean(fieldErrors.correo_electronico)}
        helperText={fieldErrors.correo_electronico}
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

      
      <Button type="submit" variant="contained">Enviar</Button>
      
      <LinkForgot to="/recuperar-contrasena">Reenviar código</LinkForgot>

    </Form>

  )
}

export default FormRecoverCode;
