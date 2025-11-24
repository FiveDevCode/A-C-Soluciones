import { TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { handleUpdatePassword } from '../../controllers/common/updatePassword.controller';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 35%;
  max-width: 500px;
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;

  & > *:first-child {
    width: 50%;
  }
  & > *:nth-child(2) {
    width: 40%;
    background-color: #17A2B8;
  }
`;

const FormRecoverChange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({});
    setIsSubmitting(true);

    if (password !== passwordConfirm) {
      setErrorMsg("Las contraseñas no coinciden.");
      setIsSubmitting(false);
      return;
    }

    try {
      await handleUpdatePassword(email, code, password);
      setSuccessMsg("La contraseña se ha cambiado correctamente. Redirigiendo...");
      setTimeout(() => {
        navigate("/iniciar-sesion");
      }, 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Hubo un error al cambiar la contraseña.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        size="medium"
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
      <TextField
        label="Confirmar contraseña"
        type="password"
        fullWidth
        size="medium"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={password && password !== passwordConfirm}
        helperText={
          password && password !== passwordConfirm
            ? "Las contraseñas no coinciden."
            : ""
        }
        FormHelperTextProps={{
          sx: {
            backgroundColor: '#F2F5F7',
            margin: 0,
          },
        }}
      />

      {errorMsg && (
        <Typography
          color="error"
          sx={{
            backgroundColor: '#FDECEA',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            borderLeft: '6px solid #f44336',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <ErrorOutlineIcon />
          {errorMsg}
        </Typography>
      )}

      {successMsg && (
        <Typography
          color="primary"
          sx={{
            backgroundColor: '#E6F4EA',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            borderLeft: '6px solid #4CAF50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <CheckCircleIcon />
          {successMsg}
        </Typography>
      )}
      
      <ContainerButton>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Guardar Cambios"}
        </Button>
        <Button type="button" variant="contained" LinkComponent={Link} to="/iniciar-sesion">
          Cancelar
        </Button>
      </ContainerButton>
    </Form>
  );
};

export default FormRecoverChange;
