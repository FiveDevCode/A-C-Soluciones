import { Button, TextField, Typography } from "@mui/material";
import ScreenSuccess from "../../components/common/ScreenSuccess";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logoRegister from "../../assets/administrator/registerAdmin.png"

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

const ContainerRegister = styled.div`
  display: flex;
  gap: 5rem;
`
const ImgRegister = styled.img`
  width: 360px;
  height: 360px;
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
    <div>
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
            <Button type="submit" variant="contained" LinkComponent={Link} to="/administrator-permit">Siguiente</Button>
            <Button type="button" variant="contained">Limpiar Campos</Button>
          </ContainerButton>

          {showSuccess && (
            <ScreenSuccess onClose={() => setShowSuccess(false)}>
              El empleado fue registrado con éxito!
            </ScreenSuccess>
          )}
        </Form>
        <ImgRegister src={logoRegister}></ImgRegister>
      </ContainerRegister>



    </div>
  )
}


export default CreateAdministratorAd;