import { TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleLogin } from '../../controllers/common/login.controller';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from 'jwt-decode';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 35%;
  max-width: 500px;
`;

const LinkForgot = styled(Link)`
  align-self: flex-end;
  color: #0000EE;
  text-decoration: underline;
  font-size: 1.05rem;
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;

  & > *:first-child {
    width: 50%;
  }
  & > *:nth-child(2) {
    width: 40%;
    background-color:#17A2B8;
  }
`;

const FormLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionExpired = params.get('sessionExpired');

    if (sessionExpired === 'true') {
      setErrorMsg("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
    }
  }, [location.search]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          return;
        }

        const role = decoded.rol;
        switch (role) {
          case "cliente":
            navigate("/cliente/inicio");
            break;
          case "tecnico":
            navigate("/tecnico/inicio");
            break;
          case "administrador":
            navigate("/admin/inicio");
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    if (!email || !password) {
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await handleLogin(email, password);
      localStorage.setItem('authToken', data.token);

      const decoded = jwtDecode(data.token);
      const role = decoded.rol;
      localStorage.setItem('userRole', role);

      // Gestión de sesión/tab para múltiples pestañas
      const sessionId = localStorage.getItem('sessionId') || `${Date.now()}_${Math.random()}`;
      localStorage.setItem('sessionId', sessionId);

      let tabKey = sessionStorage.getItem('tabKey');
      if (!tabKey) {
        tabKey = `tab_${sessionId}_${Math.random()}`;
        sessionStorage.setItem('tabKey', tabKey);
      }

      localStorage.setItem(tabKey, 'open');

      switch (role) {
        case "cliente":
          navigate("/cliente/inicio");
          break;
        case "tecnico":
          navigate("/tecnico/inicio");
          break;
        case "administrador":
          navigate("/admin/inicio");
          break;
        default:
          navigate("/iniciar-sesion");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Correo o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  

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
        type={showPassword ? 'text' : 'password'}
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                aria-label="toggle password visibility"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={{ fontSize: "22px" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {errorMsg && (
        <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
          {errorMsg}
        </Typography>
      )}

      <LinkForgot to="/recuperar-contrasena">¿Has olvidado tu contraseña?</LinkForgot>

      <ContainerButton>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Button>
        <Button type="button" variant="contained" LinkComponent={Link} to="/registrarse">
          Crear Cuenta
        </Button>
      </ContainerButton>
    </Form>
  );
};

export default FormLogin;
