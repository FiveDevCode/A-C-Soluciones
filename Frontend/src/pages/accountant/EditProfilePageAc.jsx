import styled from 'styled-components';
import { Alert, Button, Collapse, IconButton, Skeleton, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAccountingAc } from '../../controllers/accountant/getAccountingAc.controller';
import { handleUpdateAccountingAc } from '../../controllers/accountant/updateAccountingAc.controller';
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
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
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
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
    color: white;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
    text-transform: none;
    font-size: 0.95rem;
    border-radius: 8px;
    flex: 1;
    
    &:hover {
      background: linear-gradient(135deg, #00a884 0%, #00beb9 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
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
        <Skeleton variant="circular" width={100} height={100} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width={250} height={35} />
          <Skeleton variant="text" width={100} height={25} />
        </div>
      </ProfileInfo>
      <FormCard>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: '4px', mb: 2 }} />
        ))}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Skeleton variant="rectangular" height={45} sx={{ flex: 1, borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={45} sx={{ flex: 1, borderRadius: '8px' }} />
        </div>
      </FormCard>
    </Content>
  </Container>
);

const EditProfilePageAc = () => {
  const navigate = useNavigate();

  const [contabilidad, setContabilidad] = useState(null);
  const [numero_de_cedula, setNumeroDeCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo_electronico, setCorreoElectronico] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {
      await handleUpdateAccountingAc(id, {
        numero_de_cedula,
        nombre,
        apellido,
        telefono,
        correo_electronico
      });

      setFieldErrors({});
      setErrorMsg("");
      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        navigate("/contador/perfil");
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
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        const decoded = jwtDecode(token);
        const response = await handleGetAccountingAc(decoded.id);
        
        const data = response.data;
        setContabilidad(data);
        setNumeroDeCedula(data.numero_de_cedula || "");
        setNombre(data.nombre || "");
        setApellido(data.apellido || "");
        setTelefono(data.telefono || "");
        setCorreoElectronico(data.correo_electronico || "");

        setOriginalData({
          numero_de_cedula: data.numero_de_cedula || "",
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          telefono: data.telefono || "",
          correo_electronico: data.correo_electronico || ""
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    fetchProfile();
  }, []);

  const hasChanges = () => {
    return (
      nombre !== originalData.nombre ||
      apellido !== originalData.apellido ||
      telefono !== originalData.telefono ||
      correo_electronico !== originalData.correo_electronico
    );
  };

  if (!contabilidad) {
    return <SkeletonLoader />;
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
            <FontAwesomeIcon icon={faUserCircle} />
          </Avatar>
          <UserInfo>
            <UserName>{contabilidad?.nombre} {contabilidad?.apellido}</UserName>
            <UserRole>Contador</UserRole>
          </UserInfo>
        </ProfileInfo>

        <FormCard>
          <FormTitle>Información Personal</FormTitle>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Cédula"
              fullWidth
              value={numero_de_cedula}
              disabled
              InputProps={{
                readOnly: true,
              }}
              helperText="Este campo solo puede ser editado por el administrador"
            />
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={handleChange(setNombre, 'nombre')}
              error={Boolean(fieldErrors.nombre)}
              helperText={fieldErrors.nombre}
            />
            <TextField
              label="Apellido"
              fullWidth
              value={apellido}
              onChange={handleChange(setApellido, 'apellido')}
              error={Boolean(fieldErrors.apellido)}
              helperText={fieldErrors.apellido}
            />
            <TextField
              label="Teléfono"
              fullWidth
              value={telefono}
              onChange={handleChange(setTelefono, 'telefono')}
              error={Boolean(fieldErrors.telefono)}
              helperText={fieldErrors.telefono}
            />
            <TextField
              label="Correo Electrónico"
              fullWidth
              value={correo_electronico}
              onChange={handleChange(setCorreoElectronico, 'correo_electronico')}
              error={Boolean(fieldErrors.correo_electronico)}
              helperText={fieldErrors.correo_electronico}
            />

            {errorMsg && (
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
            )}

            {showSuccess && (
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
            )}

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

export default EditProfilePageAc;
