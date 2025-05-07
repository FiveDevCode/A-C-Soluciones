import { Button, TextField, Typography } from '@mui/material';
import styled from 'styled-components';
import { handleCreateRequest } from '../../controllers/client/createRequestCl.controller';
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import ScreenSuccess from '../common/ScreenSuccess';


const ContainerRequest = styled.section`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
`
const ContentRequest = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: 600px;
  gap: 1.5rem;

`

const TitleRequest = styled.div`
  padding: 1rem 0;
  padding-left: 1rem;
  border: 1px solid rgba(0,0,0,0.35);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;

`

const ContainerButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: end;
  padding: 1rem;
  padding-right: 0;
 
`

const ScreenRequestCl = ({ requestId, onClose }) => {


  const [serviceAddress, setServiceAddress] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [clientId, setClientId] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setClientId(decoded.id); 
    }
  }, []);



  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateRequest(
        serviceAddress,
        description,
        comments,
        requestId,
        clientId
      );

      setShowSuccess(true);
      setErrorMsg("");
    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Hubo un error al registrar el técnico.");
      }
    }

  }


  return (
    <ContainerRequest>
      <ContentRequest>
        <TitleRequest>
          <h1>Monitoreo y Mantenimiento</h1>
        </TitleRequest>
        <Form onSubmit={handleSubmit}>
          <TextField 
            label="Dirección de servicio" 
            fullWidth size="medium" 
            value={serviceAddress} 
            onChange={(e) => setServiceAddress(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.direccion_servicio)}
            helperText={fieldErrors.direccion_servicio}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,

              },
            }}
          />
          <TextField 
            label="Descripcion del problema" 
            fullWidth size="medium" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.descripcion)}
            helperText={fieldErrors.descripcion}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,

              },
            }}
          />
          <TextField 
            label="Comentarios" 
            fullWidth size="medium" 
            value={comments} 
            onChange={(e) => setComments(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.comentarios)}
            helperText={fieldErrors.comentarios}
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
            <Button variant='contained' onClick={onClose}>Cancelar</Button> 
            <Button type='submit' variant='contained'>Confirmar</Button> 
          </ContainerButton>
        </Form>
        {showSuccess && (
          <ScreenSuccess onClose={() => setShowSuccess(false)}>
            La solicitud fue enviada con exito!
          </ScreenSuccess>
        )}

      </ContentRequest>
    </ContainerRequest>
  )
}

export default ScreenRequestCl;