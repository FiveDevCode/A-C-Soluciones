import { TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

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
  align-items: center;

  & > *:first-child {
    width: 50%;

  }
  & > *:nth-child(2)  {
    width: 40%;
    align-self: center;
  }


`

const FormCreateCl = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);
  
  return (
    <Form>
      <TextField 
        label="Nombre" 
        fullWidth size="medium" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Apellidos" 
        fullWidth size="medium" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <TextField 
        label="Celular" 
        fullWidth size="medium" 
        type='number'
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
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

      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Aceptas los <Link href="#">Términos y condiciones</Link>
          </Typography>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={offersAccepted}
            onChange={(e) => setOffersAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Quiero recibir ofertas personalizadas de A&C Soluciones. Consulta las <Link href="#">Políticas de privacidad</Link>
          </Typography>
        }
      />


      <ContainerButton>
        <Button type="submit" variant="contained">Crear cuenta</Button>
        <LinkForgot to="/login">¿Ya tienes cuenta?</LinkForgot>
      </ContainerButton>

    </Form>

  )
}

export default FormCreateCl;

