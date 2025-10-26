import React, { useState } from "react";
import styled from "styled-components";
import {
  TextField,
  MenuItem,
  Button,
  Collapse,
  Alert,
  IconButton,
  Box,
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
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #000;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
`;

const FormCreateInventory = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    cantidad_disponible: "",
    estado: "",
    id_administrador: ""
  });

  // Categorías
  const categorias = [
    "electricas",
    "manuales",
    "medicion"
  ];

  const categoriasDisplay = {
    electricas: "Eléctricas",
    manuales: "Manuales",
    medicion: "Medición"
  };

  // Estados sin modificar
  const estados = ["Nueva", "Dañada", "En mantenimiento"];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      setShowSuccess(true);
      handleLimpiar();

      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Error al registrar la herramienta"
      );
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
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Agregar herramienta</Title>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            size="small"
            value={formData.nombre}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.nombre)}
            helperText={fieldErrors.nombre}
          />

          <TextField
            label="Código"
            name="codigo"
            fullWidth
            size="small"
            value={formData.codigo}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.codigo)}
            helperText={fieldErrors.codigo}
          />

          {/* Categorías */}
          <TextField
            select
            label="Categoría"
            name="categoria"
            fullWidth
            size="small"
            value={formData.categoria}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {categoriasDisplay[cat]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Cantidad"
            name="cantidad_disponible"
            type="number"
            fullWidth
            size="small"
            value={formData.cantidad_disponible}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* Estados con valores exactos */}
          <TextField
            select
            label="Estado"
            name="estado"
            fullWidth
            size="small"
            value={formData.estado}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>

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

          <ButtonsContainer>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              Guardar
            </Button>

            <Button
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
            </Button>

            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </ButtonsContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FormCreateInventory;
