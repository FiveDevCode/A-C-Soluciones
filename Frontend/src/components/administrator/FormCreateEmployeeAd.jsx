import { TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import {handleCreateSubmitTechnical} from "../../controllers/administrator/createTc.controller"
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ScreenSuccess from "../common/ScreenSuccess"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 40%;
  max-width: 700px;
`



const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;

  }
  & > *:nth-child(2)  {
    width: 35%;
    background-color:#17A2B8;
  }


`

const FormCreateEmployeeAd = () => {

  const navigate = useNavigate();


  const [nameUser, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [IdCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);


  const handleSubmit = async(event) => {
    event.preventDefault(); 

    try {
      await handleCreateSubmitTechnical(
        IdCard,
        nameUser,
        lastName,
        email,
        phone,
        password,
        position
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();
      
    } catch (err) {
      setErrorMsg("");
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response.data.message);
      }
    }
  };

  const handleLimpiar = () => {
    setNameUser("");
    setLastName("");
    setIdCard("");
    setPhone("");
    setPosition("");
    setEmail("");
    setPassword("");

  };


  return (
    <Form onSubmit={handleSubmit}>
      <TextField 
        label="Nombre" 
        fullWidth 
        size="medium" 
        value={nameUser} 
        onChange={(e) => setNameUser(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.nombre)}
        helperText={fieldErrors.nombre}
      />
      <TextField 
        label="Apellido" 
        fullWidth 
        size="medium" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.apellido)}
        helperText={fieldErrors.apellido}
      />
      <TextField 
        label="Cedula" 
        fullWidth 
        size="medium" 
        value={IdCard} 
        onChange={(e) => setIdCard(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.numero_de_cedula)}
        helperText={fieldErrors.numero_de_cedula}
      />
      <TextField 
        label="Teléfono" 
        fullWidth 
        size="medium" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.telefono)}
        helperText={fieldErrors.telefono}
      />
      <TextField 
        label="Cargo" 
        fullWidth 
        size="medium" 
        value={position} 
        onChange={(e) => setPosition(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.especialidad)}
        helperText={fieldErrors.especialidad}
      />
      <TextField 
        label="Correo electrónico" 
        fullWidth 
        size="medium" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.correo_electronico)}
        helperText={fieldErrors.correo_electronico}
      /> 
      <TextField 
        label="Contraseña" 
        fullWidth 
        size="medium" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        sx={{ backgroundColor: 'white' }}
        error={Boolean(fieldErrors.contrasenia)}
        helperText={fieldErrors.contrasenia}
      /> 


      {errorMsg && (
        <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
          {errorMsg}
        </Typography>
      )}

      <ContainerButton>
        <Button type="submit" variant="contained">Registrar</Button>
        <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar campos</Button>
      </ContainerButton>

      {showSuccess && (
        <ScreenSuccess onClose={() => setShowSuccess(false)}>
          El empleado fue registrado con éxito!
        </ScreenSuccess>
      )}

    </Form>

  )
}

export default FormCreateEmployeeAd;