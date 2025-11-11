import { Alert, Button, Collapse, IconButton, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import {handleCreateService} from "../../controllers/administrator/createServiceAd.controller.js"
import registerService from "../../assets/administrator/registerService.png"
import CloseIcon from '@mui/icons-material/Close';

const ContainerRegisterAll = styled.section`
  display: flex;
  justify-content: center;

`

const ContainerRegister = styled.div`
  display: flex;
  flex-direction: column;
  width: min-content;
`


const TitleService = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 80%;
  font-weight: 400;
  color: #505050;
`
const ContentForm = styled.div`
  display: flex;
  gap: 3rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`

const ImgRegisterService = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
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
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  

  const handleLimpiar = () => {
    setNameService("");
    setDescription("");

  };

  return (
    <ContainerRegisterAll>
      <ContainerRegister>
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
                ¡La visita fue asignada con exito!
              </Alert>
            </Collapse>

            <ContainerButton>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar servicio"}
              </Button>
              <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar Campos</Button>
            </ContainerButton>

          </Form>
          <ImgRegisterService src={registerService} alt="logo crear servicio"/>
        </ContentForm>

      </ContainerRegister>
    </ContainerRegisterAll>
  )
}

export default CreateServiceAd;