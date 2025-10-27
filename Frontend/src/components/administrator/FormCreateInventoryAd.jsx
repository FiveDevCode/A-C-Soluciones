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
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { handleCreateInventory } from "../../controllers/accountant/createInventoryAc.controller";

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

const FormCreate = styled.form`
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

const FormCreateInventory = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    cantidad_disponible: "",
    estado: "",
    id_administrador: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categorias = ["electricas", "manuales", "medicion"];
  const categoriasDisplay = {
    electricas: "Eléctricas",
    manuales: "Manuales",
    medicion: "Medición",
  };
  const estados = ["Nueva", "Dañada", "En mantenimiento"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);
      const id = decoded.id;

      await handleCreateInventory({
        ...formData,
        id_administrador: parseInt(id),
      });

      setFieldErrors({});
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();

      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setShowSuccess(false);
      setErrorMsg("");
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response?.data?.message || "Error al registrar la herramienta");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setFormData({
      nombre: "",
      codigo: "",
      categoria: "",
      cantidad_disponible: "",
      estado: "",
      id_administrador: "",
    });
    setFieldErrors({});
    setErrorMsg("");
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Agregar herramienta</Title>

        <FormCreate onSubmit={handleSubmit}>
          <StyledTextField
            label="Nombre"
            name="nombre"
            fullWidth
            size="small"
            value={formData.nombre}
            onChange={handleChange}
            error={Boolean(fieldErrors.nombre)}
            helperText={fieldErrors.nombre}
          />

          <StyledTextField
            label="Código"
            name="codigo"
            fullWidth
            size="small"
            value={formData.codigo}
            onChange={handleChange}
            error={Boolean(fieldErrors.codigo)}
            helperText={fieldErrors.codigo}
          />

          <StyledTextField
            select
            label="Categoría"
            name="categoria"
            fullWidth
            size="small"
            value={formData.categoria}
            onChange={handleChange}
            error={Boolean(fieldErrors.categoria)}
            helperText={fieldErrors.categoria}
            SelectProps={{
              onClose: () => document.activeElement.blur(),
              MenuProps: { disableScrollLock: true },
            }}
            onBlur={(e) => e.target.blur()}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoriasDisplay[cat]}
              </MenuItem>
            ))}
          </StyledTextField>

          <StyledTextField
            label="Cantidad"
            name="cantidad_disponible"
            type="number"
            fullWidth
            size="small"
            value={formData.cantidad_disponible}
            onChange={handleChange}
            error={Boolean(fieldErrors.cantidad_disponible)}
            helperText={fieldErrors.cantidad_disponible}
          />

          <StyledTextField
            select
            label="Estado"
            name="estado"
            fullWidth
            size="small"
            value={formData.estado}
            onChange={handleChange}
            error={Boolean(fieldErrors.estado)}
            helperText={fieldErrors.estado}
            SelectProps={{
              onClose: () => document.activeElement.blur(),
              MenuProps: { disableScrollLock: true },
            }}
            onBlur={(e) => e.target.blur()}
          >
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </StyledTextField>

          {errorMsg && (
            <Collapse in={!!errorMsg}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setErrorMsg("")}
                  >
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
                ¡Herramienta registrada exitosamente!
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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </StyledButton>

            <StyledButton
              type="button"
              variant="contained"
              onClick={handleLimpiar}
              sx={{
                backgroundColor: "#ffea00",
                color: "#000",
                "&:hover": { backgroundColor: "#ffda00" },
              }}
            >
              Limpiar
            </StyledButton>

            <StyledButton
              type="button"
              variant="contained"
              color="error"
              onClick={onClose}
            >
              Cancelar
            </StyledButton>
          </ButtonsContainer>
        </FormCreate>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FormCreateInventory;
