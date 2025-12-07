import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  TextField,
  MenuItem,
  Button,
  Autocomplete,
} from "@mui/material";
import { useToastContext } from "../../contexts/ToastContext";

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
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.25s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 1350px) {
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

  @media (max-width: 1350px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1350px) {
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

  @media (max-width: 1350px) {
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
  justify-content: center;
  gap: 3rem;
  margin-top: 25px;

  @media (max-width: 1350px) {
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

  @media (max-width: 1350px) {
    && {
      font-size: 0.6875rem;
      padding: 0.125rem 1rem;
      min-width: 4.375rem;
      height: 1.75rem;
      border-radius: 0.3125rem;
    }
  }
`;

const BaseEditModal = ({
  title = "Editar Registro",
  fields,
  initialData = {},
  onSubmit,
  onClose,
  onSuccess,
  successMessage = "Actualizado correctamente",
  onFieldChange,
  additionalContent,
}) => {
  const { showToast } = useToastContext();

  const [formData, setFormData] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Actualiza los valores cuando cambian los datos iniciales
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onFieldChange?.(name, value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const errors = {};
    fields.forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name] === "")) {
        errors[field.name] = `${field.label} es obligatorio`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Por favor, complete todos los campos obligatorios", "error", 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('💾 Guardando cambios...');
      await onSubmit(formData);
      
      console.log('✅ Guardado exitoso, recargando datos...');
      // Llamar a onSuccess ANTES de cerrar para recargar datos
      if (onSuccess) {
        await onSuccess();
        console.log('✅ Recarga completada');
      }
      
      onClose();
      showToast(successMessage, "success", 4000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        showToast("Error en los campos del formulario", "error", 5000);
      } else {
        showToast(err.response?.data?.message || "Error al actualizar", "error", 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <ModalOverlay>
      <ModalContent>
        <Title>{title}</Title>

        <FormContainer onSubmit={handleFormSubmit}>
          {fields.map((field) => {
            if (field.type === "autocomplete") {
              return (
                <Autocomplete
                  key={field.name}
                  freeSolo={false}
                  options={field.options || []}
                  value={
                    // Buscar el objeto completo basado en el value almacenado
                    field.options?.find(opt => opt.value === formData[field.name]) || null
                  }
                  onChange={(event, newValue) => {
                    // Extraer solo el value del objeto seleccionado
                    const extractedValue = newValue?.value || "";
                    const syntheticEvent = {
                      target: {
                        name: field.name,
                        value: extractedValue,
                      },
                    };
                    handleChange(syntheticEvent);
                  }}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      label={field.label}
                      size="small"
                      error={Boolean(fieldErrors[field.name])}
                      helperText={fieldErrors[field.name]}
                    />
                  )}
                  ListboxProps={{
                    style: { zIndex: 99999 }
                  }}
                  componentsProps={{
                    popper: {
                      style: { zIndex: 99999 }
                    }
                  }}
                  sx={{ marginBottom: '16px' }}
                />
              );
            }

            return (
              <StyledTextField
                key={field.name}
                select={field.type === "select"}
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "date"
                    ? "date"
                    : field.type === "datetime-local"
                    ? "datetime-local"
                    : field.type === "textarea"
                    ? ""
                    : "text"
                }
                label={field.label}
                name={field.name}
                fullWidth
                size="small"
                value={formData[field.name] ?? ""}
                onChange={handleChange}
                error={Boolean(fieldErrors[field.name])}
                helperText={fieldErrors[field.name]}
                inputProps={field.inputProps}
                InputLabelProps={{
                  shrink: field.type === "date" || field.type === "datetime-local" ? true : undefined
                }}
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
            );
          })}

          {/* Contenido adicional */}
          {additionalContent}

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
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cerrar
            </StyledButton>
          </ButtonsContainer>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
    </>
  );
};

export default BaseEditModal;
