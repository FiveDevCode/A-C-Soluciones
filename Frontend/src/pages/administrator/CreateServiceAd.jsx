import { Button, TextField, Typography } from "@mui/material";
import ScreenSuccess from "../../components/common/ScreenSuccess";
import styled from "styled-components";
import { useState } from "react";
import {handleCreateService} from "../../controllers/administrator/createServiceAd.controller.js"
import registerService from "../../assets/administrator/registerService.png"

const TitleService = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  width: 55%;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 70%;
  font-weight: 400;
  color: #505050;
`
const ContentForm = styled.div`
  display: flex;
  gap: 5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  max-width: 600px;
`

const ImgRegisterService = styled.img`
  width: 360px;
  height: 360px;
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



const CreateServiceAd = () => {



  const [nameService, setNameService] = useState("");
  const [description, setDescription] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);


  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateService(
        nameService,
        description
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();
    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response);
      }
    }
  }
  

  const handleLimpiar = () => {
    setNameService("");
    setDescription("");

  };

  return (
    <div>
      <TitleService>
        Registra aquí los nuevos servicios ingresando sus datos y 
        categoría. Esto permitirá habilitarlos en el sistema con las configuraciones correspondientes.
      </TitleService>
      <TextHelp>
        Por favor, completa todos los campos requeridos para continuar con el registro del servicio.
      </TextHelp>
      <ContentForm>
        <Form onSubmit={handleSubmit}>
          <TextField 
            label="Nombre del servicio" 
            fullWidth size="medium" 
            value={nameService} 
            onChange={(e) => setNameService(e.target.value)}
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
            label="Descripción" 
            fullWidth size="medium" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            multiline
            minRows={4}
            error={Boolean(fieldErrors.descripcion)}
            helperText={fieldErrors.descripcion}
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
            <Button type="submit" variant="contained">Registrar</Button>
            <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar Campos</Button>
          </ContainerButton>

          {showSuccess && (
            <ScreenSuccess onClose={() => setShowSuccess(false)}>
              El servicio fue creado con exito!
            </ScreenSuccess>
          )}
        </Form>
        <ImgRegisterService src={registerService}/>
      </ContentForm>

    </div>
  )
}

export default CreateServiceAd;