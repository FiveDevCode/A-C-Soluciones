import styled from "styled-components";
import {
  TextField,
  Button,
  Collapse,
  Alert,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { handleCreateInventory } from "../../controllers/accountant/createInventoryAc.controller";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;
  }

  & > *:nth-child(2) {
    width: 35%;
    background-color: #17a2b8;
  }
`;

const FormCreateInventoryAd = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    cantidad_disponible: "",
    estado: "Nueva",
    id_administrador: "",
    estado_herramienta: "activo",
  });

  const categorias = [
    "electricas",
    "manuales",
    "medicion",
    "neumaticas",
    "jardineria",
    "seguridad",
    "otras",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {
      await handleCreateInventory({
        ...formData,
        id_administrador: parseInt(id),
      });

      setFieldErrors({});
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();

      setTimeout(() => {
        navigate(`/admin/inventario`);
      }, 3000);
    } catch (err) {
      setErrorMsg("");
      setFieldErrors({});

      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, message]) => {
          formattedErrors[field] = message;
        });
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(
          err.response?.data?.message || "Error al registrar la herramienta"
        );
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
      estado: "Disponible",
      id_administrador: "",
      estado_herramienta: "activo",
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Nombre"
        name="nombre"
        fullWidth
        size="medium"
        value={formData.nombre}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.nombre)}
        helperText={fieldErrors.nombre}
      />

      <TextField
        label="Código"
        name="codigo"
        fullWidth
        size="medium"
        value={formData.codigo}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.codigo)}
        helperText={fieldErrors.codigo}
      />

      {/* Campo: Categoría con opciones predefinidas */}
      <TextField
        select
        label="Categoría"
        name="categoria"
        fullWidth
        size="medium"
        value={formData.categoria}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.categoria)}
        helperText={fieldErrors.categoria}
      >
        {categorias.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Cantidad disponible"
        name="cantidad_disponible"
        type="number"
        fullWidth
        size="medium"
        value={formData.cantidad_disponible}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.cantidad_disponible)}
        helperText={fieldErrors.cantidad_disponible}
      />

      <TextField
        select
        label="Estado"
        name="estado"
        fullWidth
        size="medium"
        value={formData.estado}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.estado)}
        helperText={fieldErrors.estado}
      >
        <MenuItem value="Nueva">Nueva</MenuItem>
        <MenuItem value="Dañada">Dañada</MenuItem>
        <MenuItem value="En mantenimiento">En mantenimiento</MenuItem>
      </TextField>



      <TextField
        select
        label="Estado de herramienta"
        name="estado_herramienta"
        fullWidth
        size="medium"
        value={formData.estado_herramienta}
        onChange={handleInputChange}
        sx={{ backgroundColor: "white" }}
      >
        <MenuItem value="activo">Activo</MenuItem>
        <MenuItem value="inactivo">Inactivo</MenuItem>
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

      <ContainerButton>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar"}
        </Button>
        <Button type="button" variant="contained" onClick={handleLimpiar}>
          Limpiar campos
        </Button>
      </ContainerButton>
    </Form>
  );
};

export default FormCreateInventoryAd;
