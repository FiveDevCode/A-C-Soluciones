import styled from "styled-components";
import {
  Alert,
  Button,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import inventoryIcon from "../../assets/administrator/registerInventoryAd.png";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { handleGetInventoryAd } from "../../controllers/administrator/getInventoryAd.controller";
import { handleUpdateInventoryAd } from "../../controllers/administrator/updateInventoryAd.controller";

const Main = styled.main`
  background: white;
  padding: 2rem;
  width: 80%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 5%;
`;

const TitleHelp = styled.h4`
  margin-top: 1rem;
  margin-bottom: 2rem;
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

const SkeletonButton = styled(Skeleton)`
  align-self: flex-end;
  &.MuiSkeleton-root {
    margin-right: 4rem;
  }
`;

const ContainerButtonSkeleton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;
  }
  & > *:nth-child(2) {
    width: 35%;
  }
`;

const SkeletonLoader = () => (
  <Main>
    <ProfileInfo>
      <Skeleton variant="circular" width={120} height={120} />
      <Skeleton variant="text" width={300} height={40} />
    </ProfileInfo>

    <Divider />
    <TitleHelp>
      <Skeleton variant="text" width={200} height={30} />
    </TitleHelp>

    <Form>
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={56}
          sx={{ borderRadius: "4px", backgroundColor: "#e0e0e0" }}
        />
      ))}

      <ContainerButtonSkeleton>
        <SkeletonButton variant="rectangular" height={36} />
        <SkeletonButton variant="rectangular" height={36} />
      </ContainerButtonSkeleton>
    </Form>
  </Main>
);

export const EditInventoryPageAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [toolData, setToolData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    cantidad_disponible: "",
    estado: "",
    estado_herramienta: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetInventoryAd(id);
        const data = response.data;
        setToolData(data);

        const formattedData = {
          nombre: data.nombre || "",
          codigo: data.codigo || "",
          categoria: data.categoria || "",
          cantidad_disponible: data.cantidad_disponible || "",
          estado: data.estado || "",
          estado_herramienta: data.estado_herramienta || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (error) {
        console.error(error);
        setErrorMsg("Error al cargar la información de la herramienta.");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    try {
      await handleUpdateInventoryAd(id, formData);
      setShowSuccess(true);
      setTimeout(() => navigate(`/admin/inventario/${id}`), 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(
          ([field, message]) => (formattedErrors[field] = message)
        );
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(
          err.response?.data?.message || "Error al actualizar la herramienta."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!toolData) return <SkeletonLoader />;

  return (
    <Main>
      <ProfileInfo>
        <Avatar src={inventoryIcon} alt="Herramienta" />
        <h2>{`Herramienta: ${toolData.nombre}`}</h2>
      </ProfileInfo>

      <Divider />
      <TitleHelp>Información de la herramienta</TitleHelp>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Nombre de la herramienta"
          name="nombre"
          fullWidth
          value={formData.nombre}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.nombre)}
          helperText={fieldErrors.nombre}
        />

        <TextField
          label="Código"
          name="codigo"
          fullWidth
          value={formData.codigo}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.codigo)}
          helperText={fieldErrors.codigo}
        />

        <TextField
          label="Categoría"
          name="categoria"
          select
          fullWidth
          value={formData.categoria}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.categoria)}
          helperText={fieldErrors.categoria}
        >
          <MenuItem value="electricas">Eléctricas</MenuItem>
          <MenuItem value="manuales">Manuales</MenuItem>
          <MenuItem value="medicion">Medición</MenuItem>
          <MenuItem value="neumaticas">Neumáticas</MenuItem>
          <MenuItem value="jardineria">Jardinería</MenuItem>
          <MenuItem value="seguridad">Seguridad</MenuItem>
          <MenuItem value="otras">Otras</MenuItem>
        </TextField>

        <TextField
          label="Cantidad disponible"
          name="cantidad_disponible"
          type="number"
          fullWidth
          value={formData.cantidad_disponible}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.cantidad_disponible)}
          helperText={fieldErrors.cantidad_disponible}
        />

        <TextField
          label="Estado"
          name="estado"
          fullWidth
          value={formData.estado}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.estado)}
          helperText={fieldErrors.estado}
        />

        <TextField
          label="Estado de la herramienta"
          name="estado_herramienta"
          select
          fullWidth
          value={formData.estado_herramienta}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.estado_herramienta)}
          helperText={fieldErrors.estado_herramienta}
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
            ¡Herramienta actualizada exitosamente!
          </Alert>
        </Collapse>

        <ContainerButton>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !hasChanges()}
          >
            {isSubmitting ? "Actualizando..." : "Guardar cambios"}
          </Button>
          <Button type="button" variant="contained" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </ContainerButton>
      </Form>
    </Main>
  );
};
