import React, { useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

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
  max-height: 90vh;         /* 🔥 LIMITE DE ALTO */
  overflow-y: auto;         /* 🔥 SCROLL INTERNO */
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.25);

  /* evita que el scroll tape contenido */
  scrollbar-width: thin;
  scrollbar-color: #bdbdbd transparent;

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
  justify-content: space-between;
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

const UploadButton = styled.label`
  background-color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const FileList = styled.div`
  margin-bottom: 1rem;
`;

const FileItem = styled.div`
  background-color: #90caf9;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BaseFormModal = ({
  title,
  fields,
  onSubmit,
  onClose,
  onSuccess,
  successMessage = "Guardado exitosamente"
}) => {
  const [formData, setFormData] = useState(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  // Nuevo estado para archivos
  const [files, setFiles] = useState(
    Object.fromEntries(
      fields
        .filter((f) => f.type === "file")
        .map((f) => [f.name, null])
    )
  );

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files: fileInput } = e.target;

    // Si es archivo
    if (fileInput) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileInput[0],
      }));
      return;
    }

    // Si es texto normal
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (showSuccess) setShowSuccess(false);
  };

  const handleReset = () => {
    setFormData(Object.fromEntries(fields.map((f) => [f.name, ""])));

    setFiles(
      Object.fromEntries(
        fields
          .filter((f) => f.type === "file")
          .map((f) => [f.name, null])
      )
    );

    setErrorMsg("");
    setFieldErrors({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        ...files,
      });

      handleReset();
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
        setErrorMsg(err.response?.data?.message || "Error al guardar");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>{title}</Title>

        <FormContainer onSubmit={handleFormSubmit} autoComplete="off">
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: "1rem" }}>

              {field.type === "file" ? (
                <>
                  <UploadButton>
                    {`Subir imagen "${field.label}"`}{" "}
                    <FontAwesomeIcon icon={faUpload} style={{ marginLeft: "8px" }} />
                    <input
                      type="file"
                      name={field.name}
                      hidden
                      onChange={handleChange}
                    />
                  </UploadButton>

                  {files[field.name] && (
                    <FileList>
                      <FileItem>
                        {files[field.name].name}
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setFiles((prev) => ({
                              ...prev,
                              [field.name]: null,
                            }))
                          }
                        />
                      </FileItem>
                    </FileList>
                  )}

                  {fieldErrors[field.name] && (
                    <div style={{ color: "red", fontSize: "0.8rem" }}>
                      {fieldErrors[field.name]}
                    </div>
                  )}
                </>
              ) : (
                <StyledTextField
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
                  multiline={field.type === "textarea"}
                  rows={field.type === "textarea" ? 3 : undefined}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={Boolean(fieldErrors[field.name])}
                  helperText={fieldErrors[field.name]}
                  InputLabelProps={{
                    shrink:
                      field.type === "date" ||
                      field.type === "datetime-local"
                        ? true
                        : undefined,
                  }}
                >
                  {field.type === "select" &&
                    field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </StyledTextField>
              )}
            </div>
          ))}

          {/* Errores generales / Éxito */}
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
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </StyledButton>

            <StyledButton type="button" variant="contained" onClick={handleReset}>
              Limpiar
            </StyledButton>

            <StyledButton type="button" variant="contained" color="error" onClick={onClose}>
              Cancelar
            </StyledButton>
          </ButtonsContainer>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
export default BaseFormModal;