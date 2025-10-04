import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, Skeleton, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAdminId } from '../../controllers/administrator/getAdminIdAd.controller';
import adminProfile from "../../assets/administrator/admin.png"
import { handleUpdateAdmin } from '../../controllers/administrator/updateAdminAd.controller';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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

const SkeletonButton = styled(Skeleton)`
  align-self: flex-end;
  &.MuiSkeleton-root {
    margin-right: 4rem;

  }

`
const ContainerButtonSkeleton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;

  }
  & > *:nth-child(2)  {
    width: 35%;
  }
`


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimatedCheck = styled(CheckCircleIcon)`
  margin-left: 0.5rem;
  color: white;
  animation: ${fadeIn} 0.4s ease-in-out;
`;

const SkeletonLoader = () => (
  <Main>
    <ProfileInfo>
      <Skeleton variant="circular" width={120} height={120} />
      <Skeleton variant="text" width={300} height={40} />
    </ProfileInfo>

    <Divider />
    <TitleHelp>
      <Skeleton variant="text" width={200} height={30} />
    </TitleHelp>

    <Form>
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={56}
          sx={{ borderRadius: "4px", backgroundColor: "#e0e0e0" }}
        />
      ))}

      <ContainerButtonSkeleton>
        <SkeletonButton variant="rectangular" height={36} />
        <SkeletonButton variant="rectangular" height={36} />
      </ContainerButtonSkeleton>
    </Form>
  </Main>
);

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
    

  const [originalData, setOriginalData] = useState({});

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
      setIsSubmitting(false);
      
      setTimeout(() => {
        navigate("/admin/perfil/");
      }, 3000);
      
    } catch (err) {
      setFieldErrors({});
      setErrorMsg("");
      setIsSubmitting(false);

      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } 
      
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Ocurrió un error inesperado.");
      }
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


        setOriginalData({
          numero_cedula: res.data.numero_cedula || "",
          nombre: res.data.nombre || "",
          apellido: res.data.apellido || "",
          correo_electronico: res.data.correo_electronico || "",
        });

      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });
  }, []);

  const hasChanges = () => {
    return (
      IdCard !== originalData.numero_cedula ||
      nameUser !== originalData.nombre ||
      lastName !== originalData.apellido ||
      email !== originalData.correo_electronico
    );
  };

  if (!userAdmin) {
    return <SkeletonLoader />
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
          error={Boolean(fieldErrors.numero_cedula)}
          helperText={fieldErrors.numero_cedula}
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
          <Button type="submit" variant="contained" disabled={isSubmitting || showSuccess || !hasChanges()}>
            {isSubmitting
              ? "Editando..."
              : showSuccess
                ? <>
                    Editado
                    <AnimatedCheck />
                  </>
                : "Editar"}
          </Button>
          <Button type="button" variant="contained" onClick={() => navigate(-1)}>Cancelar</Button>
        </ContainerButton>

      </Form>
    </Main>
  );
};

export default EditAdminPageAd;