import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import adminProfile from "../../assets/administrator/admin.png"
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleUpdateClient } from '../../controllers/administrator/updateClient.controller';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';


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

const EditClientAd = () => {

  const navigate = useNavigate();
  const {id} = useParams();

  const [userClient, setUserClient] = useState();
  const [IdCard, setIdCard] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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

    try {
      await handleUpdateClient(
        id,
        IdCard,
        nameUser,
        lastName,
        email,
        phone,
        address
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      
      setTimeout(() => {
        navigate(`/admin/perfil-cliente/${id}`);
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
    handleGetClient(id)
      .then((res) => {
        const data = res.data;
        setUserClient(data);
        setIdCard(data.numero_de_cedula || "");
        setNameUser(data.nombre || "");
        setLastName(data.apellido || "");
        setEmail(data.correo_electronico || "");
        setAddress(data.direccion || "");
        setPhone(data.telefono || "");

        setOriginalData({
          numero_de_cedula: data.numero_de_cedula || "",
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo_electronico: data.correo_electronico || "",
          direccion: data.direccion || "",
          telefono: data.telefono || ""
        });
      })
  }, []);

  const hasChanges = () => {
    return (
      IdCard !== originalData.numero_de_cedula ||
      nameUser !== originalData.nombre ||
      lastName !== originalData.apellido ||
      email !== originalData.correo_electronico ||
      address !== originalData.direccion ||
      phone !== originalData.telefono
    );
  };


  if (!userClient) {
    return <SkeletonLoader />
  }

  return (
    <Main>
      <ProfileInfo>
        <Avatar
          src={adminProfile}
          alt="Avatar"
        />
        <h2>{`${userClient.nombre} ${userClient.apellido}`}</h2>
      </ProfileInfo>      

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
        <TextField 
          label="Dirrecion" 
          fullWidth 
          size="medium" 
          value={address} 
          onChange={handleChange(setAddress)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.direccion)}
          helperText={fieldErrors.direccion}
        /> 
        <TextField 
          label="Celular" 
          fullWidth 
          size="medium" 
          value={phone} 
          onChange={handleChange(setPhone)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.telefono)}
          helperText={fieldErrors.telefono}
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
  );
};

export default EditClientAd;