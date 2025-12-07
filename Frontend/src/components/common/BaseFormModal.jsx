import React, { useState } from "react";
import styled from "styled-components";
import {
  TextField,
  MenuItem,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useToastContext } from "../../contexts/ToastContext";

// ======== ESTILOS HEREDADOS ========
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10000;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.$active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f5f5f5"};
  color: ${props => props.$active ? "white" : "#666"};
  font-weight: ${props => props.$active ? "600" : "400"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e0e0e0"};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  position: relative;
  z-index: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const EquipmentCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f9f9f9;
`;

const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const UploadButton = styled.label`
  background-color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 4px;
  display: block;
  margin-bottom: 1rem;
  cursor: pointer;
  text-align: center;
`;

const FileItem = styled.div`
  background-color: #90caf9;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  margin-top: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Exportar componentes styled para uso externo
export { FormGrid, FullWidth, EquipmentCard };

const BaseFormModal = ({
  title,
  steps,
  fields,
  onSubmit,
  onClose,
  onSuccess,
  successMessage = "Guardado exitosamente",
  customFormData,
  onFormDataChange,
  extraContent,
  renderStepContent,
}) => {

  // ========= DETECCIÓN DE MULTIPASOS =========
  const isMultiStep = Array.isArray(steps) && steps.length > 0;

  // Si NO es multipaso, usamos fields como siempre
  const normalizedSteps = isMultiStep
    ? steps
    : [{ title: "Formulario", fields: fields || [] }];

  const totalSteps = normalizedSteps.length;
  const [currentStep, setCurrentStep] = useState(0);

  const allFields = normalizedSteps.flatMap((s) => s.fields);

  // ========= ESTADOS PRINCIPALES =========
  const { showToast } = useToastContext();

  const [formData, setFormData] = useState(
    customFormData || Object.fromEntries(
      allFields
        .filter((f) => f.type !== "file")
        .map((f) => [f.name, ""])
    )
  );

  const [files, setFiles] = useState(
    Object.fromEntries(
      allFields
        .filter((f) => f.type === "file")
        .map((f) => [f.name, null])
    )
  );

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========= HANDLE CHANGE =========
  const handleChange = (e) => {
    const { name, value, files: fileInput } = e.target;

    if (fileInput) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileInput[0],
      }));
      return;
    }

    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    onFormDataChange?.(newFormData);
  };

  // ========= RESET =========
  const handleReset = () => {
    setFormData(
      Object.fromEntries(
        allFields
          .filter((f) => f.type !== "file")
          .map((f) => [f.name, ""])
      )
    );

    setFiles(
      Object.fromEntries(
        allFields
          .filter((f) => f.type === "file")
          .map((f) => [f.name, null])
      )
    );

    setFieldErrors({});
  };

  // ========= SUBMIT FINAL =========
  const handleSubmitFinal = async () => {
    // Validar campos requeridos
    const errors = {};
    allFields.forEach((field) => {
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
      await onSubmit({ ...formData, ...files });

      handleReset();
      onClose();
      
      setTimeout(() => {
        showToast(successMessage, "success", 4000);
        onSuccess?.();
      }, 500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        showToast("Error en los campos del formulario", "error", 5000);
      } else {
        showToast(err.response?.data?.message || "Error al guardar", "error", 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const isFullWidth = field.fullWidth || field.type === "textarea" || field.type === "file";
    const FieldWrapper = isFullWidth ? FullWidth : "div";

    return (
      <FieldWrapper key={field.name}>
        {field.type === "file" ? (
          <>
            <UploadButton>
              {`Subir imagen "${field.label}"`}{" "}
              <FontAwesomeIcon icon={faUpload} style={{ marginLeft: "8px" }} />
              <input
                type="file"
                name={field.name}
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </UploadButton>

            {files[field.name] && (
              <FileItem>
                {files[field.name].name}
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setFiles((prev) => ({
                      ...prev,
                      [field.name]: null,
                    }))
                  }
                />
              </FileItem>
            )}

            {fieldErrors[field.name] && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {fieldErrors[field.name]}
              </div>
            )}
          </>
        ) : field.type === "autocomplete" ? (
          <Autocomplete
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
              <TextField
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
          />
        ) : (
          <TextField
            select={field.type === "select"}
            type={
              field.type === "number"
                ? "number"
                : field.type === "date"
                ? "date"
                : field.type === "datetime-local"
                ? "datetime-local"
                : "text"
            }
            label={field.label}
            name={field.name}
            fullWidth
            size="small"
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 3 : undefined}
            value={formData[field.name]}
            onChange={handleChange}
            error={Boolean(fieldErrors[field.name])}
            helperText={fieldErrors[field.name]}
            inputProps={field.inputProps}
            InputLabelProps={{
              shrink:
                field.type === "date" ||
                field.type === "datetime-local"
                  ? true
                  : undefined,
            }}
            SelectProps={
              field.type === "select"
                ? {
                    MenuProps: {
                      style: { zIndex: 10001 }
                    }
                  }
                : undefined
            }
          >
            {field.type === "select" &&
              field.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
          </TextField>
        )}
      </FieldWrapper>
    );
  };

  return (
    <>
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Header>

        {/* Indicador de pasos */}
        {isMultiStep && (
          <StepIndicator>
            {normalizedSteps.map((step, index) => (
              <Step 
                key={index} 
                $active={currentStep === index}
                onClick={() => setCurrentStep(index)}
              >
                {step.title}
              </Step>
            ))}
          </StepIndicator>
        )}

        <Content>
          {/* Renderizar campos del paso actual */}
          {isMultiStep ? (
            <>
              {normalizedSteps[currentStep].fields.length > 0 && (
                <FormGrid>
                  {normalizedSteps[currentStep].fields.map(renderField)}
                </FormGrid>
              )}
              {/* Renderizar contenido personalizado por paso */}
              {renderStepContent?.(currentStep)}
            </>
          ) : (
            <>
              <FormGrid>
                {fields?.map(renderField)}
              </FormGrid>
              {/* Contenido extra para formularios simples */}
              {extraContent}
            </>
          )}
        </Content>

        {/* BOTONES */}
        <Footer>
          {isMultiStep && currentStep > 0 && (
            <Button 
              variant="outlined" 
              disabled={isSubmitting}
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              Anterior
            </Button>
          )}

          {isMultiStep && currentStep < totalSteps - 1 ? (
            <Button 
              variant="contained" 
              disabled={isSubmitting}
              onClick={() => setCurrentStep((s) => s + 1)}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmitFinal}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          )}

          {!isMultiStep && (
            <Button 
              variant="outlined" 
              disabled={isSubmitting}
              onClick={handleReset}
            >
              Limpiar
            </Button>
          )}
        </Footer>
      </Modal>
    </ModalOverlay>
    </>
  );
};

export default BaseFormModal;
