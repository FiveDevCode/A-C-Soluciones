import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import serviceLogo from "../../assets/administrator/service-view.png"
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleGetService } from '../../controllers/administrator/getServiceAd.controller';
import { handleUpdateService } from '../../controllers/administrator/updateServiceAd.controller';


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
  border-radius: 5%;
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

const EditServicePageAd = () => {

  const navigate = useNavigate();
  const {id} = useParams();

  const [service, setService] = useState();
  const [nameService, setNameService] = useState("");
  const [description, setDescription] = useState("");

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
      await handleUpdateService(
        id,
        nameService,
        description,
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      
      setTimeout(() => {
        navigate(`/admin/servicio/${id}`);
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
    handleGetService(id)
      .then((res) => {
        const data = res.data.data;
        setService(data)
        setNameService(data.nombre || "");
        setDescription(data.descripcion || "");

        setOriginalData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
        });
      })
  }, []);

  const hasChanges = () => {
    return (
      nameService !== originalData.nombre ||
      description !== originalData.descripcion
    );
  };


  if (!service) {
    return <SkeletonLoader />
  }

  return (
    <Main>
      <ProfileInfo>
        <Avatar
          src={serviceLogo}
          alt="Avatar"
        />
        <h2>{`${service.nombre}`}</h2>
      </ProfileInfo>      

      <Divider />

      <TitleHelp>Informacion personal</TitleHelp>
      <Form onSubmit={handleSubmit}>
        <TextField 
          label="Nombre" 
          fullWidth 
          size="medium" 
          value={nameService} 
          onChange={handleChange(setNameService)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.nombre)}
          helperText={fieldErrors.nombre}
        />
        <TextField 
          label="Descripcion" 
          fullWidth 
          multiline
          rows={4}
          size="medium" 
          value={description} 
          onChange={handleChange(setDescription)}
          sx={{ backgroundColor: 'white' }}
          error={Boolean(fieldErrors.descripcion)}
          helperText={fieldErrors.descripcion}
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

export default EditServicePageAd;