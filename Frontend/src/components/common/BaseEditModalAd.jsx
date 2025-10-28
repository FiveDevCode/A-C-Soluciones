import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TextField,
  MenuItem,
  Button,
  Collapse,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// ======== ESTILOS HEREDADOS ========
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.25);

  @media (max-width: 1280px) {
    width: 330px;
    padding: 20px;
    border-radius: 12px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #000;
  font-size: 20px;

  @media (max-width: 1280px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1280px) {
    gap: 0.5rem;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-input {
    font-size: 14px;
  }
  & .MuiFormLabel-root {
    font-size: 14px;
  }
  margin-bottom: 16px;

  @media (max-width: 1280px) {
    margin-bottom: 12px;
    & .MuiInputBase-input {
      font-size: 12px;
    }
    & .MuiFormLabel-root {
      font-size: 12px;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;

  @media (max-width: 1280px) {
    margin-top: 15px;
    gap: 6px;
  }
`;

const StyledButton = styled(Button)`
  && {
    font-size: 0.875rem;
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    text-transform: none;
    font-weight: 600;
    min-width: 5.625rem;
    height: 2.25rem;
  }

  @media (max-width: 1280px) {
    && {
      font-size: 0.6875rem;
      padding: 0.125rem 1rem;
      min-width: 4.375rem;
      height: 1.75rem;
      border-radius: 0.3125rem;
    }
  }
`;

// ====================== COMPONENTE BASE DE EDICIÓN ======================
const BaseEditModal = ({
  title = "Editar Registro",
  fields,
  initialData = {},
  onSubmit,
  onClose,
  onSuccess,
  successMessage = "Actualizado correctamente",
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Actualiza los valores cuando cambian los datos iniciales
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (showSuccess) setShowSuccess(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setShowSuccess(false);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response?.data?.message || "Error al actualizar");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>{title}</Title>

        <FormContainer onSubmit={handleFormSubmit}>
          {fields.map((field) => (
            <StyledTextField
              key={field.name}
              select={field.type === "select"}
              type={field.type === "number" ? "number" : "text"}
              label={field.label}
              name={field.name}
              fullWidth
              size="small"
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              error={Boolean(fieldErrors[field.name])}
              helperText={fieldErrors[field.name]}
              SelectProps={{
                onClose: () => document.activeElement.blur(),
                MenuProps: { disableScrollLock: true },
              }}
            >
              {field.type === "select" &&
                field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
            </StyledTextField>
          ))}

          {errorMsg && (
            <Collapse in={!!errorMsg}>
              <Alert
                severity="error"
                action={
                  <IconButton onClick={() => setErrorMsg("")} size="small">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
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
                  <IconButton onClick={() => setShowSuccess(false)} size="small">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {successMessage}
              </Alert>
            </Collapse>
          )}

          <ButtonsContainer>
            <StyledButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {isSubmitting ? "Guardando..." : "Actualizar"}
            </StyledButton>

            <StyledButton
              type="button"
              variant="contained"
              color="error"
              onClick={onClose}
            >
              Cerrar
            </StyledButton>
          </ButtonsContainer>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BaseEditModal;
