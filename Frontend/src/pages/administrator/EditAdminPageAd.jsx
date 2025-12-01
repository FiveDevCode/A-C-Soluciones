import styled from 'styled-components';
import { Alert, Button, Collapse, IconButton, Skeleton, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAdminId } from '../../controllers/administrator/getAdminIdAd.controller';
import adminProfile from "../../assets/administrator/admin.png"
import { handleUpdateAdmin } from '../../controllers/administrator/updateAdminAd.controller';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { keyframes } from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding-left: 70px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const ProfileInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.3rem 0;
  color: #2d3436;
`;

const UserRole = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  color: #2d3436;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0;
`;

const SubmitButton = styled(Button)`
  &.MuiButton-root {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
    text-transform: none;
    font-size: 0.95rem;
    border-radius: 8px;
    flex: 1;
    
    &:hover {
      background: linear-gradient(135deg, #556dd9 0%, #653a91 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      background: #b2bec3;
      color: white;
    }
  }
`;

const CancelButton = styled(Button)`
  &.MuiButton-root {
    background: #636e72;
    color: white;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
    text-transform: none;
    font-size: 0.95rem;
    border-radius: 8px;
    flex: 1;
    
    &:hover {
      background: #2d3436;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 110, 114, 0.3);
    }
  }
`;

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
  animation: ${fadeIn} 0.4s ease-in-out;
`;

const SkeletonLoader = () => (
  <Container>
    <Header>
      <HeaderContent>
        <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </HeaderContent>
    </Header>
    <Content>
      <ProfileInfo>
        <Skeleton variant="circular" width={70} height={70} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width={250} height={30} />
          <Skeleton variant="text" width={100} height={25} />
        </div>
      </ProfileInfo>
      <FormCard>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: '4px', mb: 2 }} />
        ))}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Skeleton variant="rectangular" height={42} sx={{ flex: 1, borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={42} sx={{ flex: 1, borderRadius: '8px' }} />
        </div>
      </FormCard>
    </Content>
  </Container>
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

  const handleChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (showSuccess) setShowSuccess(false);
    // Limpiar el error específico del campo cuando el usuario escribe
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    // Limpiar mensaje de error general si existe
    if (errorMsg) setErrorMsg("");
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

      setFieldErrors({});
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
    <Container>
      <Header>
        <HeaderContent>
          <Title>Editar Perfil</Title>
          <Subtitle>Actualiza tu información personal</Subtitle>
        </HeaderContent>
      </Header>

      <Content>
        <ProfileInfo>
          <Avatar>
            <img src={adminProfile} alt="Avatar" />
          </Avatar>
          <UserInfo>
            <UserName>{userAdmin?.nombre} {userAdmin?.apellido}</UserName>
            <UserRole>Administrador</UserRole>
          </UserInfo>
        </ProfileInfo>

        <FormCard>
          <FormTitle>Información Personal</FormTitle>
          <Form onSubmit={handleSubmit}>
            <TextField 
              label="Cédula" 
              fullWidth 
              value={IdCard} 
              onChange={handleChange(setIdCard, 'numero_cedula')}
              error={Boolean(fieldErrors.numero_cedula)}
              helperText={fieldErrors.numero_cedula}
            />
            <TextField 
              label="Nombre" 
              fullWidth 
              value={nameUser} 
              onChange={handleChange(setNameUser, 'nombre')}
              error={Boolean(fieldErrors.nombre)}
              helperText={fieldErrors.nombre}
            />
            <TextField 
              label="Apellido" 
              fullWidth 
              value={lastName} 
              onChange={handleChange(setLastName, 'apellido')}
              error={Boolean(fieldErrors.apellido)}
              helperText={fieldErrors.apellido}
            />
            <TextField 
              label="Correo electrónico" 
              fullWidth 
              value={email} 
              onChange={handleChange(setEmail, 'correo_electronico')}
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
              >
                ¡La información fue editada con éxito!
              </Alert>
            </Collapse>

            <ButtonContainer>
              <SubmitButton 
                type="submit" 
                disabled={isSubmitting || showSuccess || !hasChanges()}
              >
                {isSubmitting
                  ? "Guardando..."
                  : showSuccess
                    ? <>
                        Guardado
                        <AnimatedCheck />
                      </>
                    : "Guardar Cambios"}
              </SubmitButton>
              <CancelButton type="button" onClick={() => navigate(-1)}>
                Cancelar
              </CancelButton>
            </ButtonContainer>
          </Form>
        </FormCard>
      </Content>
    </Container>
  );
};

export default EditAdminPageAd;