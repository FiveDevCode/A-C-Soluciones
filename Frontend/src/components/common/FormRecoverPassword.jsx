import { TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleCreateForgotPassword } from '../../controllers/common/createForgotPassword.controller';
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
    background-color:#17A2B8;
  }
`;

const FormRecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

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

    try {
      console.log(email)
      await handleCreateForgotPassword(email);
      setSuccessMsg("Se ha enviado un correo para recuperar tu contraseña.");

      setTimeout(() => {
        navigate("/codigo-recuperacion", { state: { email } })
      }, 3000)
    } catch (err) {
      setErrorMsg("");
      setFieldErrors({});
      console.log(err)
      setIsSubmitting(false);

      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } 
      
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Hubo un error al registrar al administrador.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField 
        label="Correo electrónico" 
        fullWidth
        size="medium" 
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
        <Button type="submit" variant="contained" disabled={isSubmitting || successMsg}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
        <Button type="button" variant="contained" LinkComponent={Link} to="/iniciar-sesion">Cancelar</Button>
      </ContainerButton>
    </Form>
  );
};

export default FormRecoverPassword;
