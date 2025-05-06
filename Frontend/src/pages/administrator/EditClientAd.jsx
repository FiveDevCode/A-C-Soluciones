import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ScreenSuccess from "../../components/common/ScreenSuccess";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import { handleUpdateClient } from "../../controllers/administrator/updateClient.controller";



const TitleEdit = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 70%;
  font-weight: 400;
  color: #505050;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  max-width: 600px;
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


const EditClientAd = () => {

  const navigate = useNavigate();


  const [idCard, setIdCard] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { id } = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);


  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleUpdateClient(
        id,
        idCard,
        name,
        lastName,
        email,
        phone,
        address
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      navigate(`/profile-client/${id}`)
    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response.data.message);
      }
    }

  }

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await handleGetClient(id);

        setIdCard(client.data.numero_de_cedula || "");
        setName(client.data.nombre || "");
        setLastName(client.data.apellido || "");
        setPhone(client.data.telefono || "");
        setEmail(client.data.correo_electronico || "");
        setAddress(client.data.direccion || "");
      } catch (err) {
        console.error("Error al obtener cliente:", err);
      }
  };
    fetchClient();
  }, [id]);
  

  return (
    <div>
      <TitleEdit>Informacion personal</TitleEdit>
      <TextHelp>Por favor, asegúrate de completar todos los campos antes de guardar los cambios. No se permiten campos vacíos.</TextHelp>
      <Form onSubmit={handleSubmit}>
        <TextField 
          label="Cédula" 
          fullWidth size="medium" 
          value={idCard} 
          onChange={(e) => setIdCard(e.target.value)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.numero_de_cedula)}
          helperText={fieldErrors.numero_de_cedula}
          FormHelperTextProps={{
            sx: {
              backgroundColor: '#F2F5F7',
              margin: 0,
  
            },
          }}
        />
        <TextField 
          label="Nombre" 
          fullWidth size="medium" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.nombre)}
          helperText={fieldErrors.nombre}
          FormHelperTextProps={{
            sx: {
              backgroundColor: '#F2F5F7',
              margin: 0,
  
            },
          }}
        />
        <TextField 
          label="Apellidos" 
          fullWidth size="medium" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.apellido)}
          helperText={fieldErrors.apellido}
          FormHelperTextProps={{
            sx: {
              backgroundColor: '#F2F5F7',
              margin: 0,
  
            },
          }}
        />
        <TextField 
          label="Celular" 
          fullWidth size="medium" 
          type='number'
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.telefono)}
          helperText={fieldErrors.telefono}
          FormHelperTextProps={{
            sx: {
              backgroundColor: '#F2F5F7',
              margin: 0,
  
            },
          }}
        />
        <TextField 
          label="Dirrecion" 
          fullWidth size="medium" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.direccion)}
          helperText={fieldErrors.direccion}
          FormHelperTextProps={{
            sx: {
              backgroundColor: '#F2F5F7',
              margin: 0,
            },
          }}
        />
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

          
        {errorMsg && (
          <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
            {errorMsg}
          </Typography>
        )}

        <ContainerButton>
          <Button type="submit" variant="contained">Guardar cambios</Button>
          <Button type="button" variant="contained" LinkComponent={Link} to="/profile-client">Cancelar</Button>
        </ContainerButton>

        {showSuccess && (
          <ScreenSuccess onClose={() => setShowSuccess(false)}>
            Cliente actualizado correctamente!
          </ScreenSuccess>
        )}

      </Form>
    </div>
  )
}


export default EditClientAd;