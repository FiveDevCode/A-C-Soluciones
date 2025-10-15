import styled from 'styled-components';
import { Alert, Button, Collapse, Divider, IconButton, Skeleton, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import billIcon from "../../assets/administrator/billIcon.png"
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from "react-router-dom";
import { handleGetBillAd } from '../../controllers/administrator/getBillAd.controller';
import { handleUpdateBill } from '../../controllers/administrator/updateBillAd.controller';
import { handleGetListClient } from '../../controllers/common/getListClient.controller';

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
    background-color:#17A2B8;
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
      {[...Array(8)].map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={56} sx={{ borderRadius: "4px", backgroundColor: "#e0e0e0" }} />
      ))}

      <ContainerButtonSkeleton>
        <SkeletonButton variant="rectangular" height={36} />
        <SkeletonButton variant="rectangular" height={36} />
      </ContainerButtonSkeleton>
    </Form>
  </Main>
);

const EditBillAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bill, setBill] = useState();
  const [formData, setFormData] = useState({
    fecha_factura: '',
    id_cliente: '',
    numero_factura: '',
    concepto: '',
    monto_facturado: '',
    abonos: '',
    saldo_pendiente: '',
    fecha_vencimiento: '',
    estado_factura: 'pendiente',
  });
  const [originalData, setOriginalData] = useState({});
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchBillAndClients = async () => {
      try {
        const [billRes, clientsRes] = await Promise.all([
          handleGetBillAd(id),
          handleGetListClient(),
        ]);

        const data = billRes.data;
        setBill(data);
        setFormData({
          fecha_factura: data.fecha_factura || '',
          id_cliente: data.id_cliente || '',
          numero_factura: data.numero_factura || '',
          concepto: data.concepto || '',
          monto_facturado: data.monto_facturado || '',
          abonos: data.abonos || '',
          saldo_pendiente: data.saldo_pendiente || '',
          fecha_vencimiento: data.fecha_vencimiento || '',
          estado_factura: data.estado_factura || 'pendiente',
        });
        setOriginalData({
          fecha_factura: data.fecha_factura || '',
          id_cliente: data.id_cliente || '',
          numero_factura: data.numero_factura || '',
          concepto: data.concepto || '',
          monto_facturado: data.monto_facturado || '',
          abonos: data.abonos || '',
          saldo_pendiente: data.saldo_pendiente || '',
          fecha_vencimiento: data.fecha_vencimiento || '',
          estado_factura: data.estado_factura || 'pendiente',
        });

        setClientList(clientsRes.data || []);
        const selected = clientsRes.data.find(c => c.id === data.id_cliente);
        setSelectedClient(selected || null);

      } catch (error) {
        console.error(error);
        setErrorMsg('Error al cargar la información de la factura');
      }
    };

    fetchBillAndClients();
  }, [id]);

  const handleChange = (setter) => (e) => setter(e.target.value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return Object.keys(formData).some(key => formData[key] !== originalData[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setFieldErrors({});

    try {
      await handleUpdateBill(id, formData);
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/admin/facturas');
      }, 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, message]) => {
          formattedErrors[field] = message;
        });
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(err.response?.data?.message || 'Error al actualizar la factura');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bill) {
    return <SkeletonLoader />;
  }

  return (
    <Main>
      <ProfileInfo>
        <Avatar src={billIcon} alt="Factura" />
        <h2>{`Factura #${bill.numero_factura}`}</h2>
      </ProfileInfo>

      <Divider />
      <TitleHelp>Información de la factura</TitleHelp>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Número de factura"
          name="numero_factura"
          fullWidth
          value={formData.numero_factura}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.numero_factura)}
          helperText={fieldErrors.numero_factura}
        />

        <TextField
          label="Fecha de factura"
          name="fecha_factura"
          type="date"
          fullWidth
          value={formData.fecha_factura}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.fecha_factura)}
          helperText={fieldErrors.fecha_factura}
          InputLabelProps={{ shrink: true }}
        />

        <Autocomplete
          fullWidth
          options={clientList}
          getOptionLabel={(client) => `${client.id} - ${client.nombre} ${client.apellido}`}
          value={selectedClient}
          onChange={(event, newValue) => {
            setSelectedClient(newValue);
            setFormData(prev => ({ ...prev, id_cliente: newValue ? newValue.id : '' }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente"
              placeholder="Buscar por ID o nombre"
              error={Boolean(fieldErrors.id_cliente)}
              helperText={fieldErrors.id_cliente}
            />
          )}
        />

        <TextField
          label="Concepto"
          name="concepto"
          multiline
          rows={3}
          fullWidth
          value={formData.concepto}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.concepto)}
          helperText={fieldErrors.concepto}
        />

        <TextField
          label="Monto facturado"
          name="monto_facturado"
          type="number"
          fullWidth
          value={formData.monto_facturado}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.monto_facturado)}
          helperText={fieldErrors.monto_facturado}
        />

        <TextField
          label="Abonos"
          name="abonos"
          type="number"
          fullWidth
          value={formData.abonos}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.abonos)}
          helperText={fieldErrors.abonos}
        />

        <TextField
          label="Saldo pendiente"
          name="saldo_pendiente"
          type="number"
          fullWidth
          value={formData.saldo_pendiente}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.saldo_pendiente)}
          helperText={fieldErrors.saldo_pendiente}
        />

        <TextField
          label="Fecha de vencimiento"
          name="fecha_vencimiento"
          type="date"
          fullWidth
          value={formData.fecha_vencimiento}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.fecha_vencimiento)}
          helperText={fieldErrors.fecha_vencimiento}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Estado de factura"
          name="estado_factura"
          fullWidth
          value={formData.estado_factura}
          onChange={handleInputChange}
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="pagada">Pagada</MenuItem>
          <MenuItem value="vencida">Vencida</MenuItem>
        </TextField>

        <Collapse in={!!errorMsg}>
          <Alert
            severity="error"
            action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setErrorMsg('')}>
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
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setShowSuccess(false)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            ¡Factura actualizada exitosamente!
          </Alert>
        </Collapse>

        <ContainerButton>
          <Button type="submit" variant="contained" disabled={isSubmitting || !hasChanges()}>
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

export default EditBillAd;
