import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import {handleCreateSubmitTechnical} from "../../controllers/technical/createTc.controller"
import styled from 'styled-components';

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
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [IdCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = (event) => {
    event.preventDefault(); 

    handleCreateSubmitTechnical(
      IdCard,
      name,
      lastName,
      email,
      phone,
      password,
      position
    );
  };

  const handleLimpiar = () => {
    setName("");
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
        fullWidth size="medium" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Apellido" 
        fullWidth size="medium" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Cedula" 
        fullWidth size="medium" 
        value={IdCard} 
        onChange={(e) => setIdCard(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Teléfono" 
        fullWidth size="medium" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Cargo" 
        fullWidth size="medium" 
        value={position} 
        onChange={(e) => setPosition(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
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


      <ContainerButton>
        <Button type="submit" variant="contained">Registrar</Button>
        <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar campos</Button>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateEmployeeAd