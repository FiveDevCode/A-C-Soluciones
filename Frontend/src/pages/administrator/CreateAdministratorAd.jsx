import { Button, TextField, Typography } from "@mui/material";
import ScreenSuccess from "../../components/common/ScreenSuccess";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logoRegister from "../../assets/administrator/registerAdmin.png"

const ContainerRegisterAll = styled.section`
  display: flex;
  justify-content: center;
`
const ContentRegister = styled.div`
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
  width: 90%;
  font-weight: 400;
  color: #505050;
`

const ContainerRegister = styled.div`
  display: flex;
  gap: 3rem;
`
const ImgRegister = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
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


const CreateAdministratorAd = () => {

  const [nameService, setNameService] = useState("");
  const [description, setDescription] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateSubmitClient(
        nameService,
        description
      );

      navigate("/login");
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
    <ContainerRegisterAll>
      <ContentRegister>
        <TitleService>
          Registra aquí a los nuevos administradores ingresando sus datos y rol. 
          Esto les dará acceso al sistema con los permisos correspondientes.
        </TitleService>
        <TextHelp>
          Por favor, completa todos los campos requeridos para continuar con el registro del administrador.
        </TextHelp>
        <ContainerRegister>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Nombre" 
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
              multiline
              rows={4}
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

              
            {errorMsg && (
              <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
                {errorMsg}
              </Typography>
            )}

            <ContainerButton>
              <Button type="submit" variant="contained" LinkComponent={Link} to="/admin/permisos">Siguiente</Button>
              <Button type="button" variant="contained">Limpiar Campos</Button>
            </ContainerButton>

            {showSuccess && (
              <ScreenSuccess onClose={() => setShowSuccess(false)}>
                El empleado fue registrado con éxito!
              </ScreenSuccess>
            )}
          </Form>
          <ImgRegister src={logoRegister} alt="logo registrar administrador"></ImgRegister>
        </ContainerRegister>



      </ContentRegister>
    </ContainerRegisterAll>

  )
}


export default CreateAdministratorAd;