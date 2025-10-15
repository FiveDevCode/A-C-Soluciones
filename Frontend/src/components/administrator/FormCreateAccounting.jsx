import { TextField, Button, Collapse, Alert, IconButton } from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { handleCreateSubmitAccounting } from '../../controllers/administrator/createAccountingAd.controller';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;
  }

  & > *:nth-child(2) {
    width: 35%;
    background-color: #17a2b8;
  }
`;

const FormCreateAccounting = () => {
  const [IdCard, setIdCard] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await handleCreateSubmitAccounting(
        IdCard,
        nameUser,
        lastName,
        email,
        phone,
        password
      );

      setFieldErrors({});
      setErrorMsg('');
      setShowSuccess(true);
      handleLimpiar();
    } catch (err) {
      setErrorMsg('');
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response?.data?.message || 'Error al crear el Contador');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setIdCard('');
    setNameUser('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        label="Cédula"
        fullWidth
        size="medium"
        value={IdCard}
        onChange={handleChange(setIdCard)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.numero_de_cedula)}
        helperText={fieldErrors.numero_de_cedula}
      />
      <TextField
        label="Nombre"
        fullWidth
        size="medium"
        value={nameUser}
        onChange={handleChange(setNameUser)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.nombre)}
        helperText={fieldErrors.nombre}
      />
      <TextField
        label="Apellido"
        fullWidth
        size="medium"
        value={lastName}
        onChange={handleChange(setLastName)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.apellido)}
        helperText={fieldErrors.apellido}
      />
      <TextField
        label="Correo electrónico"
        fullWidth
        size="medium"
        value={email}
        onChange={handleChange(setEmail)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.correo_electronico)}
        helperText={fieldErrors.correo_electronico}
      />
      <TextField
        label="Teléfono"
        fullWidth
        size="medium"
        value={phone}
        onChange={handleChange(setPhone)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.telefono)}
        helperText={fieldErrors.telefono}
        autoComplete="new-email" 
      />
      <TextField
        label="Contraseña"
        fullWidth
        size="medium"
        type="password"
        value={password}
        onChange={handleChange(setPassword)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.contrasenia)}
        helperText={fieldErrors.contrasenia}
        autoComplete="new-password" 
      />

      <Collapse in={!!errorMsg}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setErrorMsg('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errorMsg}
        </Alert>
      </Collapse>

      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowSuccess(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          ¡El contador fue creado con éxito!
        </Alert>
      </Collapse>

      <ContainerButton>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </Button>
        <Button type="button" variant="contained" onClick={handleLimpiar}>
          Limpiar campos
        </Button>
      </ContainerButton>
    </Form>
  );
};

export default FormCreateAccounting;
