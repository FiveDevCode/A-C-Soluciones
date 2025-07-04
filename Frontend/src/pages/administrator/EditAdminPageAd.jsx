import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAdminId } from '../../controllers/administrator/getAdminIdAd.controller';
import adminProfile from "../../assets/administrator/admin.png"
import { handleUpdateAdmin } from '../../controllers/administrator/updateAdminAd.controller';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from "react-router-dom";


const Main = styled.main`
  background: white;
  padding: 2rem;
  width: 80%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const TitleHelp = styled.h4`
  margin-top: 1rem;
  margin-bottom: 2rem;
    
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

const EditAdminPageAd = () => {

  const navigate = useNavigate();

  const [userAdmin, setUserAdmin] = useState();
  const [IdCard, setIdCard] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
    
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = async(event) => {
    event.preventDefault(); 
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {
      await handleUpdateAdmin(
        id,
        IdCard,
        nameUser,
        lastName,
        email
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();

      
      setTimeout(() => {
        navigate("/admin/perfil");
      }, 3000);
      
    } catch (err) {
      setErrorMsg("");
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    handleGetAdminId(id)
      .then((res) => {
        setUserAdmin(res.data);
        setIdCard(res.data.numero_cedula || "");
        setNameUser(res.data.nombre || "");
        setLastName(res.data.apellido || "");
        setEmail(res.data.correo_electronico || "");
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });
  }, []);

  const handleLimpiar = () => {
    setNameUser("");
    setLastName("");
    setIdCard("");
    setEmail("");

  };


  
  if (!userAdmin) {
    return <p>Cargando datos del perfil...</p>;
  }

  return (
    <Main>
      <ProfileSection>
        <ProfileInfo>
          <Avatar
            src={adminProfile}
            alt="Avatar"
          />
          <h2>{`${userAdmin.nombre} ${userAdmin.apellido}`}</h2>
        </ProfileInfo>      
      </ProfileSection>

      <Divider />

      <TitleHelp>Informacion personal</TitleHelp>
      <Form onSubmit={handleSubmit}>
        <TextField 
          label="Cedula" 
          fullWidth 
          size="medium" 
          value={IdCard} 
          onChange={handleChange(setIdCard)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.numero_de_cedula)}
          helperText={fieldErrors.numero_de_cedula}
        />
        <TextField 
          label="Nombre" 
          fullWidth 
          size="medium" 
          value={nameUser} 
          onChange={handleChange(setNameUser)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.nombre)}
          helperText={fieldErrors.nombre}
        />
        <TextField 
          label="Apellido" 
          fullWidth 
          size="medium" 
          value={lastName} 
          onChange={handleChange(setLastName)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.apellido)}
          helperText={fieldErrors.apellido}
        />
        <TextField 
          label="Correo electrónico" 
          fullWidth 
          size="medium" 
          value={email} 
          onChange={handleChange(setEmail)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.correo_electronico)}
          helperText={fieldErrors.correo_electronico}
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
            ¡La informacion fue editada con exito!
          </Alert>
        </Collapse>
        <ContainerButton>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Editando..." : "Editar"}
          </Button>
          <Button type="button" variant="contained" onClick={() => navigate(-1)}>Cancelar</Button>
        </ContainerButton>

      </Form>
    </Main>
  );
};

export default EditAdminPageAd;