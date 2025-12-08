import { Button, TextField, Typography, IconButton, Alert } from '@mui/material';
import styled from 'styled-components';
import { handleCreateRequest } from '../../controllers/client/createRequestCl.controller';
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import ScreenSuccess from '../common/ScreenSuccess';
import CloseIcon from '@mui/icons-material/Close';

const ContainerRequest = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6000;
  padding: 2rem;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentRequest = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: white;

  @media screen and (max-width: 768px) {
    padding: 0.875rem 1.25rem;
  }
`;

const Title = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled(IconButton)`
  && {
    color: white;
    padding: 0.5rem;
    margin-left: 1rem;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.5rem;
  overflow-y: auto;
  max-height: calc(85vh - 160px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1.25rem;
    gap: 0.875rem;
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
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;

  @media screen and (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    flex-direction: column-reverse;

    & > * {
      width: 100%;
    }
  }
`;

const CancelButton = styled(Button)`
  && {
    background-color: #64748b;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    font-size: 0.85rem;
    min-width: auto;

    &:hover {
      background-color: #475569;
    }
  }
`;

const ConfirmButton = styled(Button)`
  && {
    background-color: #007BFF;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    font-size: 0.85rem;
    box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
    min-width: auto;

    &:hover {
      background-color: #0056b3;
      box-shadow: 0 5px 14px rgba(0, 123, 255, 0.4);
    }
  }
`;

const ErrorAlert = styled(Alert)`
  && {
    margin-top: 0.5rem;
    border-radius: 8px;
  }
`;

const ScreenRequestCl = ({ requestId, onClose }) => {
  const [serviceAddress, setServiceAddress] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [clientId, setClientId] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setClientId(decoded.id);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validar dirección de servicio
    const trimmedAddress = serviceAddress.trim();
    if (!trimmedAddress) {
      errors.direccion_servicio = 'La dirección del servicio no puede estar vacía.';
      isValid = false;
    } else if (trimmedAddress.length < 10) {
      errors.direccion_servicio = 'La dirección de servicio debe tener al menos 10 caracteres.';
      isValid = false;
    } else if (trimmedAddress.length > 255) {
      errors.direccion_servicio = 'La dirección de servicio no debe exceder los 255 caracteres.';
      isValid = false;
    }

    // Validar descripción
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      errors.descripcion = 'La descripción no puede estar vacía.';
      isValid = false;
    } else if (trimmedDescription.length < 5) {
      errors.descripcion = 'La descripción debe tener al menos 5 caracteres.';
      isValid = false;
    } else if (trimmedDescription.length > 500) {
      errors.descripcion = 'La descripción no debe exceder los 500 caracteres.';
      isValid = false;
    }

    // Validar comentarios (opcional pero con límite)
    const trimmedComments = comments.trim();
    if (trimmedComments.length > 255) {
      errors.comentarios = 'Los comentarios no deben exceder los 255 caracteres.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      await handleCreateRequest(
        serviceAddress.trim(),
        description.trim(),
        comments.trim(),
        requestId,
        clientId
      );

      setShowSuccess(true);
      setErrorMsg("");
      setFieldErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        // El backend devuelve un objeto con los errores por campo
        const backendErrors = err.response.data.errors;
        
        if (Array.isArray(backendErrors)) {
          // Compatibilidad con formato antiguo (array de mensajes)
          const fieldErrorsMap = {};
          backendErrors.forEach(errorMsg => {
            if (errorMsg.includes('dirección de servicio') || errorMsg.includes('direccion_servicio')) {
              fieldErrorsMap.direccion_servicio = errorMsg;
            } else if (errorMsg.includes('descripción') || errorMsg.includes('descripcion')) {
              fieldErrorsMap.descripcion = errorMsg;
            } else if (errorMsg.includes('comentarios')) {
              fieldErrorsMap.comentarios = errorMsg;
            }
          });
          setFieldErrors(fieldErrorsMap);
        } else {
          // Formato nuevo: objeto con claves por campo
          setFieldErrors(backendErrors);
        }
      } else {
        setErrorMsg(err.response?.data?.message || "Hubo un error al registrar la solicitud.");
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ContainerRequest onClick={handleBackdropClick}>
      <ContentRequest onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Monitoreo y Mantenimiento</Title>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <StyledTextField
            label="Dirección de servicio"
            fullWidth
            size="small"
            value={serviceAddress}
            onChange={(e) => {
              setServiceAddress(e.target.value);
              // Limpiar error del campo cuando el usuario empiece a escribir
              if (fieldErrors.direccion_servicio) {
                setFieldErrors(prev => ({ ...prev, direccion_servicio: undefined }));
              }
            }}
            error={Boolean(fieldErrors.direccion_servicio)}
            helperText={fieldErrors.direccion_servicio || `${serviceAddress.trim().length}/255 caracteres (mínimo 10)`}
            multiline
            rows={2}
            inputProps={{ maxLength: 255 }}
          />
          <StyledTextField
            label="Descripción del problema"
            fullWidth
            size="small"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              // Limpiar error del campo cuando el usuario empiece a escribir
              if (fieldErrors.descripcion) {
                setFieldErrors(prev => ({ ...prev, descripcion: undefined }));
              }
            }}
            error={Boolean(fieldErrors.descripcion)}
            helperText={fieldErrors.descripcion || `${description.trim().length}/500 caracteres (mínimo 5)`}
            multiline
            rows={3}
            inputProps={{ maxLength: 500 }}
          />
          <StyledTextField
            label="Comentarios"
            fullWidth
            size="small"
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
              // Limpiar error del campo cuando el usuario empiece a escribir
              if (fieldErrors.comentarios) {
                setFieldErrors(prev => ({ ...prev, comentarios: undefined }));
              }
            }}
            error={Boolean(fieldErrors.comentarios)}
            helperText={fieldErrors.comentarios || `${comments.trim().length}/255 caracteres (opcional)`}
            multiline
            rows={2}
            inputProps={{ maxLength: 255 }}
          />

          {errorMsg && (
            <ErrorAlert severity="error">
              {errorMsg}
            </ErrorAlert>
          )}

          <ContainerButton>
            <CancelButton variant="contained" onClick={onClose}>
              Cancelar
            </CancelButton>
            <ConfirmButton type="submit" variant="contained">
              Confirmar
            </ConfirmButton>
          </ContainerButton>
        </Form>

        {showSuccess && (
          <ScreenSuccess onClose={onClose}>
            La solicitud fue enviada con éxito!
          </ScreenSuccess>
        )}
      </ContentRequest>
    </ContainerRequest>
  );
};

export default ScreenRequestCl;
