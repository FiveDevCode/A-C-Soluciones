import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { handleGetTechnicalId } from '../../controllers/technical/getTechnicalIdTc.controller';
import { handleUpdateProfileTechnical } from '../../controllers/technical/updateProfileTechnicalTc.controller';


const PageContainer = styled.div`
  margin-left: 220px;
  padding: 2rem 4rem;
  min-height: calc(100vh);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: 180px;
    padding: 1.5rem 1rem;
  }
`;

const Main = styled.main`
  background: white;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`


const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
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

const SkeletonLoader = () => (
  <PageContainer>
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
  </PageContainer>
);

const EditProfileTc = () => {

  const navigate = useNavigate();

  const [userAdmin, setUserAdmin] = useState();
  const [nameUser, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [originalData, setOriginalData] = useState({});

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = async(event) => {
    event.preventDefault(); 
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {
      await handleUpdateProfileTechnical(
        id,
        nameUser,
        lastName,
        phone,
        email
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      
      setTimeout(() => {
        navigate(`/tecnico/perfil/`);
      }, 3000);
      
    } catch (err) {
      setErrorMsg("");
      console.log(err)
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

    handleGetTechnicalId(decoded.id)
      .then((res) => {
        const data = res.data;
        console.log(data)
        setUserAdmin(data);
        setNameUser(data.nombre || "");
        setLastName(data.apellido || "");
        setPhone(data.telefono || "");
        setEmail(data.correo_electronico || "");

        setOriginalData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          telefono: data.telefono || "",
          correo_electronico: data.correo_electronico || ""
        });
      })
  }, []);

  const hasChanges = () => {
    return (
      nameUser !== originalData.nombre ||
      lastName !== originalData.apellido ||
      phone !== originalData.telefono ||
      email !== originalData.correo_electronico
    );
  };


  if (!userAdmin) {
    return <SkeletonLoader />
  }

  return (
    <PageContainer>
      <Main>
        <ProfileInfo>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            alt="Avatar"
          />
          <h2>{`${userAdmin.nombre} ${userAdmin.apellido}`}</h2>
        </ProfileInfo>      

        <Divider />

        <TitleHelp>Informacion personal</TitleHelp>
        <Form onSubmit={handleSubmit}>
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
          label="Telefono" 
          fullWidth 
          size="medium" 
          value={phone} 
          onChange={handleChange(setPhone)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.telefono)}
          helperText={fieldErrors.telefono}
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
          <Button type="submit" variant="contained" disabled={isSubmitting || !hasChanges()}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button type="button" variant="contained" onClick={() => navigate(-1)}>Cancelar</Button>
        </ContainerButton>

        </Form>
      </Main>
    </PageContainer>
  );
};

export default EditProfileTc;