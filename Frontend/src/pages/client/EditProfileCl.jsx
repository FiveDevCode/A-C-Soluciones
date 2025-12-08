import styled from 'styled-components';
import { Alert, Button, Collapse, IconButton, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import adminProfile from "../../assets/administrator/admin.png"
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { handleUpdateClient } from '../../controllers/administrator/updateClient.controller';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';
import { jwtDecode } from 'jwt-decode';
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from '../../components/client/MenuContext'; 

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const WelcomeSection = styled.header`
  background-color: #007BFF;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1350px) {
    padding: 1.2rem;
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;

const Main = styled.main`
  background: white;
  padding: 2rem 2.5rem;
  margin: 1.5rem auto;
  max-width: 1200px;
  width: calc(100% - 4rem);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 2.5rem;
  min-height: calc(100vh - 180px);
  max-height: calc(100vh - 180px);
  overflow: hidden;

  @media screen and (max-width: 1520px) {
    padding: 1.75rem 2rem;
    margin: 1.25rem auto;
    width: calc(100% - 3rem);
    gap: 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem;
    margin: 1.25rem 1rem;
    width: calc(100% - 2rem);
    gap: 1.5rem;
    flex-direction: column;
    max-height: none;
    min-height: auto;
  }

  @media screen and (max-width: 768px) {
    padding: 1.25rem;
    margin: 1rem;
    width: calc(100% - 2rem);
    gap: 1.25rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 260px;
  max-width: 300px;
  padding-right: 1.5rem;
  border-right: 2px solid #e5e7eb;

  @media screen and (max-width: 1280px) {
    min-width: 100%;
    max-width: 100%;
    padding-right: 0;
    padding-bottom: 1.5rem;
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
    align-items: center;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media screen and (max-width: 1280px) {
    overflow-y: visible;
    padding-right: 0;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #007BFF;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
  object-fit: cover;

  @media screen and (max-width: 1280px) {
    width: 130px;
    height: 130px;
  }

  @media screen and (max-width: 768px) {
    width: 110px;
    height: 110px;
  }
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  text-align: center;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 1.35rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TitleHelp = styled.h4`
  margin: 0 0 1.25rem 0;
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #007BFF;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    & .MuiOutlinedInput-root {
      border-radius: 8px;
      background-color: white;
    }
  }
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-top: 0.5rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  & > *:first-child {
    flex: 2;
    background-color: #007BFF !important;
    
    &:hover {
      background-color: #0056b3 !important;
    }

    &:disabled {
      background-color: #cbd5e1 !important;
      color: #94a3b8 !important;
    }
  }

  & > *:nth-child(2) {
    flex: 1;
    background-color: #64748b !important;

    &:hover {
      background-color: #475569 !important;
    }
  }
`;

const SkeletonLoader = () => {
  const { collapsed } = useMenu();
  
  return (
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          EDITAR PERFIL
        </WelcomeSection>
        <Main>
          <LeftColumn>
            <AvatarContainer>
              <Skeleton variant="circular" width={150} height={150} />
              <Skeleton variant="text" width={200} height={32} />
            </AvatarContainer>
          </LeftColumn>
          <RightColumn>
            <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
            {[...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={56}
                sx={{ borderRadius: "8px", mb: 1.5 }}
              />
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Skeleton variant="rectangular" width="70%" height={42} />
              <Skeleton variant="rectangular" width="30%" height={42} />
            </div>
          </RightColumn>
        </Main>
      </PageContainer>
    </>
  );
};

const EditProfileCl = () => {
  const navigate = useNavigate();
  const { collapsed } = useMenu();

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

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token); 
    const id = decoded.id;
    setIsSubmitting(true);

    try {
      await handleUpdateClient(
        id,
        {
          numero_de_cedula: IdCard,
          nombre: nameUser,
          apellido: lastName,
          correo_electronico: email,
          telefono: phone,
          direccion: address
        }
      );

      setFieldErrors({});
      setErrorMsg("");
      setShowSuccess(true);

      setTimeout(() => {
        navigate(`/cliente/perfil`);
      }, 3000);
      
    } catch (err) {
      setErrorMsg("");
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response?.data?.message || "Error al actualizar el perfil");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token); 
    const id = decoded.id;
    
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
      .catch((err) => {
        console.error("Error al cargar el cliente:", err);
        setErrorMsg("Error al cargar los datos del perfil");
      });
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
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          EDITAR PERFIL
        </WelcomeSection>
        <Main>
          <LeftColumn>
            <AvatarContainer>
              <Avatar
                src={adminProfile}
                alt="Avatar del usuario"
              />
              <UserName>{`${userClient.nombre} ${userClient.apellido}`}</UserName>
            </AvatarContainer>
          </LeftColumn>

          <RightColumn>
            <TitleHelp>Información Personal</TitleHelp>
            <Form onSubmit={handleSubmit}>
              <StyledTextField 
                label="Cédula" 
                fullWidth 
                size="medium" 
                value={IdCard} 
                onChange={handleChange(setIdCard)}
                error={Boolean(fieldErrors.numero_de_cedula)}
                helperText={fieldErrors.numero_de_cedula}
                disabled={true}
                InputProps={{
                  readOnly: true,
                }}
              />
              <StyledTextField 
                label="Nombre" 
                fullWidth 
                size="medium" 
                value={nameUser} 
                onChange={handleChange(setNameUser)}
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre}
              />
              <StyledTextField 
                label="Apellido" 
                fullWidth 
                size="medium" 
                value={lastName} 
                onChange={handleChange(setLastName)}
                error={Boolean(fieldErrors.apellido)}
                helperText={fieldErrors.apellido}
              />
              <StyledTextField 
                label="Correo electrónico" 
                fullWidth 
                size="medium" 
                value={email} 
                onChange={handleChange(setEmail)}
                error={Boolean(fieldErrors.correo_electronico)}
                helperText={fieldErrors.correo_electronico}
              /> 
              <StyledTextField 
                label="Dirección" 
                fullWidth 
                size="medium" 
                value={address} 
                onChange={handleChange(setAddress)}
                error={Boolean(fieldErrors.direccion)}
                helperText={fieldErrors.direccion}
              /> 
              <StyledTextField 
                label="Celular" 
                fullWidth 
                size="medium" 
                value={phone} 
                onChange={handleChange(setPhone)}
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
                  sx={{ mb: 1.5 }}
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
                  sx={{ mb: 1.5 }}
                >
                  ¡La información fue editada con éxito!
                </Alert>
              </Collapse>
              
              <ContainerButton>
                <Button type="submit" variant="contained" disabled={isSubmitting || !hasChanges()}>
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button type="button" variant="contained" onClick={() => navigate('/cliente/perfil')}>
                  Cancelar
                </Button>
              </ContainerButton>
            </Form>
          </RightColumn>
        </Main>
      </PageContainer>
    </>
  );
};

export default EditProfileCl;
