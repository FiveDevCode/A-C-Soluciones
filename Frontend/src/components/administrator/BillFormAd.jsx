import styled from 'styled-components';
import { TextField, Button, Collapse, Alert, IconButton, MenuItem, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { handleGetListClient } from '../../controllers/common/getListClient.controller';
import { jwtDecode } from "jwt-decode";
import { handleCreateBill } from '../../controllers/administrator/createBillAd.controller';

const FormContainer = styled.form`
  max-width: 700px;
  margin: auto;
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;
  }

  & > *:nth-child(2) {
    width: 35%;
    background-color: #17A2B8;
  }
`;

export const BillFormAd = () => {
  const [formData, setFormData] = useState({
    fecha_factura: '',
    id_cliente: '',
    id_admin: '',
    numero_factura: '',
    concepto: '',
    monto_facturado: '',
    abonos: '',
    saldo_pendiente: '',
    fecha_vencimiento: '',
    estado_factura: 'pendiente',
  });

  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    try {
      await handleCreateBill({
        ...formData,
        id_cliente: selectedClient?.id || null,
        id_admin: parseInt(id),
      });

      setShowSuccess(true);
      setFieldErrors({});
      setErrorMsg('');

      setTimeout(() => {
        navigate(`/admin/facturas`);
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('');
      setFieldErrors({});

      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, message]) => {
          formattedErrors[field] = message;
        });
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(err.response?.data?.message || 'Error al registrar la factura');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Campo: Número de factura */}
      <TextField
        label="Número de factura"
        name="numero_factura"
        fullWidth
        margin="normal"
        value={formData.numero_factura}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.numero_factura)}
        helperText={fieldErrors.numero_factura}
      />

      {/* Campo: Fecha de factura */}
      <TextField
        label="Fecha de factura"
        name="fecha_factura"
        type="date"
        fullWidth
        margin="normal"
        value={formData.fecha_factura}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.fecha_factura)}
        helperText={fieldErrors.fecha_factura}
        InputLabelProps={{ shrink: true }}
      />

      {/* Campo: Cliente */}
      <Autocomplete
        fullWidth
        options={clientList}
        getOptionLabel={(client) =>
          `${client.id} - ${client.nombre} ${client.apellido}`
        }
        value={selectedClient}
        onChange={(event, newValue) => {
          setSelectedClient(newValue);
          setFormData((prev) => ({
            ...prev,
            id_cliente: newValue ? newValue.id : '',
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cliente"
            placeholder="Buscar por ID o nombre"
            margin="normal"
            error={Boolean(fieldErrors.id_cliente)}
            helperText={fieldErrors.id_cliente}
            sx={{ backgroundColor: 'white' }}
          />
        )}
      />

      {/* Campo: Concepto */}
      <TextField
        label="Concepto"
        name="concepto"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={formData.concepto}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.concepto)}
        helperText={fieldErrors.concepto}
      />

      {/* Campo: Monto facturado */}
      <TextField
        label="Monto facturado"
        name="monto_facturado"
        type="number"
        fullWidth
        margin="normal"
        value={formData.monto_facturado}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.monto_facturado)}
        helperText={fieldErrors.monto_facturado}
      />

      {/* Campo: Abonos */}
      <TextField
        label="Abonos"
        name="abonos"
        type="number"
        fullWidth
        margin="normal"
        value={formData.abonos}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.abonos)}
        helperText={fieldErrors.abonos}
      />

      {/* Campo: Saldo pendiente */}
      <TextField
        label="Saldo pendiente"
        name="saldo_pendiente"
        type="number"
        fullWidth
        margin="normal"
        value={formData.saldo_pendiente}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.saldo_pendiente)}
        helperText={fieldErrors.saldo_pendiente}
      />

      {/* Campo: Fecha de vencimiento */}
      <TextField
        label="Fecha de vencimiento"
        name="fecha_vencimiento"
        type="date"
        fullWidth
        margin="normal"
        value={formData.fecha_vencimiento}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.fecha_vencimiento)}
        helperText={fieldErrors.fecha_vencimiento}
        InputLabelProps={{ shrink: true }}
      />

      {/* Campo: Estado */}
      <TextField
        select
        label="Estado de factura"
        name="estado_factura"
        fullWidth
        margin="normal"
        value={formData.estado_factura}
        onChange={handleInputChange}
      >
        <MenuItem value="pendiente">Pendiente</MenuItem>
        <MenuItem value="pagada">Pagada</MenuItem>
        <MenuItem value="vencida">Vencida</MenuItem>
      </TextField>

      {/* Alertas */}
      <Collapse in={!!errorMsg}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setErrorMsg('')}
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
          ¡Factura registrada exitosamente!
        </Alert>
      </Collapse>

      {/* Botones */}
      <ContainerButton>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: '1rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando factura...' : 'Registrar factura'}
        </Button>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: '1rem' }}
          LinkComponent={Link}
          to="/admin/facturas"
        >
          Cancelar
        </Button>
      </ContainerButton>
    </FormContainer>
  );
};

export default BillFormAd;
