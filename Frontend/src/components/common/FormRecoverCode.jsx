import { TextField, Button, Typography} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { handleCreateForgotPassword } from '../../controllers/common/createForgotPassword.controller';
import { handleCreateVerificCode } from '../../controllers/common/createVerificCode.controller';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 35%;
  max-width: 500px;
`
const LinkForgot = styled.button`
  align-self: center;
  color: #0000EE;
  background: none;
  border: none;
  text-decoration: underline;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#999' : '#0000EE')};
`;

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
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await handleCreateVerificCode(email, code);
      setSuccessMsg("El codigo ingresado es correcto, redirigiendo...");
      setIsVerified(true);

      setTimeout(() => {
        navigate("/cambiar-contrasena", { state: { email, code } })
      }, 3000)
    } catch (err) {
      setErrorMsg("");
      setFieldErrors({});
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

  
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      await handleCreateForgotPassword(email);
      setSuccessMsg("Se ha reenviado el código a tu correo.");
      setResendCooldown(30);
    } catch (err) {
      setErrorMsg("No se pudo reenviar el código.");
    }
  };

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
      
      <Button type="submit" variant="contained" disabled={isSubmitting || isVerified}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
      <LinkForgot
        type="button"
        onClick={handleResend}
        disabled={resendCooldown > 0}
      >
        {resendCooldown > 0 ? `Reenviar código en ${resendCooldown}s` : "Reenviar código"}
      </LinkForgot>
    </Form>

  )
}

export default FormRecoverCode;
