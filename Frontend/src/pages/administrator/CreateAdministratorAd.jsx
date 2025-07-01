import { Alert, Button, Collapse, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logoRegister from "../../assets/administrator/registerAdmin.png"
import CloseIcon from '@mui/icons-material/Close';
import { handleCreateAdmin } from "../../controllers/administrator/createAdminAd.controller";


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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameAdmin, setNameAdmin] = useState("");
  const [lastName, setLastName] = useState("");
  const [idCard, setIdCard] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleCreateAdmin(
        idCard,
        nameAdmin,
        lastName,
        email,
        password
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();
    } catch (err) {
      setErrorMsg("");
      setFieldErrors({});
      console.log(err)

      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Hubo un error al registrar al administrador.");
      }
      
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleLimpiar = () => {
    setNameAdmin("");
    setLastName("");
    setIdCard("");
    setEmail("");
    setPassword("");
  };

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
              label="Cédula" 
              fullWidth size="medium" 
              type="number"
              value={idCard} 
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10) {
                  setIdCard(value);
                }
              }}             
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.numero_cedula)}
              helperText={fieldErrors.numero_cedula}
            />
            <TextField 
              label="Nombre" 
              fullWidth size="medium" 
              value={nameAdmin} 
              onChange={(e) => setNameAdmin(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.nombre)}
              helperText={fieldErrors.nombre}
            />
            <TextField 
              label="Apellido" 
              fullWidth size="medium" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.apellido)}
              helperText={fieldErrors.apellido}
            />
            <TextField
              label="Correo electronico" 
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
              fullWidth size="medium" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.contrasenia)}
              helperText={fieldErrors.contrasenia}
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
                ¡El administrador fue creado con exito!
              </Alert>
            </Collapse>

            <ContainerButton>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar administrador"}
              </Button>    
              <Button type="button" variant="contained" LinkComponent={Link} to="/admin/inicio">Cancelar</Button>
            </ContainerButton>
          </Form>
          <ImgRegister src={logoRegister} alt="logo registrar administrador"></ImgRegister>
        </ContainerRegister>



      </ContentRegister>
    </ContainerRegisterAll>

  )
}


export default CreateAdministratorAd;