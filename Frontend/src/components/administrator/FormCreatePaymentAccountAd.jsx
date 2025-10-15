import { TextField, Button, Collapse, Alert, IconButton, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { handleCreateSubmitPaymentAccount } from "../../controllers/administrator/createPaymentAccountAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { jwtDecode } from "jwt-decode";

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

export const FormCreatePaymentAccountAd = () => {
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [nit, setNit] = useState("");
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Obtener lista de clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await handleGetListClient();
        setClientList(response.data || []);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Obtener ID del administrador desde el token JWT
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const idAdministrador = parseInt(decoded.id);

    try {
      await handleCreateSubmitPaymentAccount(
        numeroCuenta,
        fechaRegistro,
        selectedClient?.id || null,
        idAdministrador,
        nit,
      );

      setFieldErrors({});
      setErrorMsg("");
      setShowSuccess(true);
      handleLimpiar();
    } catch (err) {
      setErrorMsg("");
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(
          err.response?.data?.message || "Error al crear la cuenta de pago"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setNumeroCuenta("");
    setFechaRegistro("");
    setIdCliente("");
    setNit("");
    setSelectedClient(null);
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        label="Número de cuenta"
        fullWidth
        size="medium"
        value={numeroCuenta}
        onChange={handleChange(setNumeroCuenta)}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.numero_cuenta)}
        helperText={fieldErrors.numero_cuenta}
      />

      <TextField
        label="Fecha de registro"
        type="date"
        fullWidth
        size="medium"
        value={fechaRegistro}
        onChange={handleChange(setFechaRegistro)}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.fecha_registro)}
        helperText={fieldErrors.fecha_registro}
        InputLabelProps={{ shrink: true }}
      />

      {/* Selector de cliente */}
      <Autocomplete
        fullWidth
        options={clientList}
        getOptionLabel={(client) =>
          `${client.id} - ${client.nombre} ${client.apellido}`
        }
        value={selectedClient}
        onChange={(event, newValue) => {
          setSelectedClient(newValue);
          setIdCliente(newValue ? newValue.id : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cliente"
            placeholder="Buscar cliente por ID o nombre"
            margin="normal"
            error={Boolean(fieldErrors.id_cliente)}
            helperText={fieldErrors.id_cliente}
            sx={{ backgroundColor: "white" }}
          />
        )}
      />

      <TextField
        label="NIT"
        fullWidth
        size="medium"
        value={nit}
        onChange={handleChange(setNit)}
        sx={{ backgroundColor: "white" }}
        error={Boolean(fieldErrors.nit)}
        helperText={fieldErrors.nit}
      />

      {/* Alertas */}
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
          ¡La cuenta de pago fue creada con éxito!
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
