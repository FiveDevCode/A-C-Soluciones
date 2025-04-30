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

const validacionFormulario = (texto) => {
  return texto.length > 0 ? true : false;  // en caso de que se mayor o igual a 0 la validacion sera valida;
}



const FormCreateEmployeeAd = () => {
  const [name, setName] = useState({
    value: "",
    valid: null,
  });
  const [lastName, setLastName] = useState({
    value: "",
    valid: null,
  });
  const [IdCard, setIdCard] = useState({
    value: "",
    valid: null,
  });
  const [phone, setPhone] = useState({
    value: "",
    valid: null,
  });
  const [position, setPosition] = useState({
    value: "",
    valid: null,
  });
  const [email, setEmail] = useState({
    value: "",
    valid: null,
  });
  const [password, setPassword] = useState({
    value: "",
    valid: null,
  });


  const handleSubmit = (event) => {
    event.preventDefault(); 

    handleCreateSubmitTechnical(
      IdCard.value,
      name.value,
      lastName.value,
      email.value,
      phone.value,
      password.value,
      position.value,
    );
  };

  const handleLimpiar = () => {
    setName({
      value: "",
      valid: null,
    });
    setLastName({
      value: "",
      valid: null,
    });
    setIdCard({
      value: "",
      valid: null,
    });
    setPhone({
      value: "",
      valid: null,
    });
    setPosition({
      value: "",
      valid: null,
    });
    setEmail({
      value: "",
      valid: null,
    });
    setPassword({
      value: "",
      valid: null,
    });

  };


  return (
    <Form onSubmit={handleSubmit}>
      <TextField 
        label="Nombre" 
        fullWidth size="medium" 
        value={name.value} 
        onChange={(e) => setName({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={name.valid === false} 
        helperText={name.valid === false && "El campo no debe estar vacio"} 
        required
      />
      <TextField 
        label="Apellido" 
        fullWidth size="medium" 
        value={lastName.value} 
        onChange={(e) => setLastName({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={lastName.valid === false} 
        helperText={lastName.valid === false && "El campo no debe estar vacio"} 
        required
      />
      <TextField 
        label="Cedula" 
        fullWidth size="medium" 
        value={IdCard.value} 
        onChange={(e) => setIdCard({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={IdCard.valid === false} 
        helperText={IdCard.valid === false && "El campo no debe estar vacio"} 
      />
      <TextField 
        label="Teléfono" 
        fullWidth size="medium" 
        value={phone.value} 
        onChange={(e) => setPhone({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={phone.valid === false} 
        helperText={phone.valid === false && "El campo no debe estar vacio"} 
      />
      <TextField 
        label="Cargo" 
        fullWidth size="medium" 
        value={position.value} 
        onChange={(e) => setPosition({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={position.valid === false} 
        helperText={position.valid === false && "El campo no debe estar vacio"} 
      />
      <TextField 
        label="Correo electrónico" 
        fullWidth size="medium" 
        value={email.value} 
        onChange={(e) => setEmail({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={email.valid === false} 
        helperText={email.valid === false && "El campo no debe estar vacio"} 
      /> 
      <TextField 
        label="Contraseña" 
        fullWidth size="medium" 
        value={password.value} 
        onChange={(e) => setPassword({value: e.target.value, valid: validacionFormulario(e.target.value)})}
        sx={{ backgroundColor: 'white' }}
        error={password.valid === false} 
        helperText={password.valid === false && "El campo no debe estar vacio"} 
      /> 


      <ContainerButton>
        <Button type="submit" variant="contained">Registrar</Button>
        <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar campos</Button>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateEmployeeAd