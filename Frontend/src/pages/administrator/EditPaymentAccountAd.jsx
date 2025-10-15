import styled from "styled-components";
import {
  Alert,
  Button,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import accountIcon from "../../assets/administrator/registerPaymentAccount.png";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { handleGetPaymentAccountAd } from "../../controllers/administrator/getPaymentAccountAd.controller";
import { handleUpdatePaymentAccountAd } from "../../controllers/administrator/updatePaymentAccountAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";

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
      {[...Array(4)].map((_, index) => (
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

export const EditPaymentAccountAd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [accountData, setAccountData] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    numero_cuenta: "",
    fecha_registro: "",
    nit: "",
    id_cliente: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes, clientsRes] = await Promise.all([
          handleGetPaymentAccountAd(id),
          handleGetListClient(),
        ]);

        console.log("DATA:", accountRes);

        const account = accountRes.data;
        setAccountData(account);
        setClientList(clientsRes.data || []);

        setFormData({
          numero_cuenta: account.numero_cuenta || "",
          fecha_registro: account.fecha_registro
            ? account.fecha_registro.split("T")[0]
            : "",
          nit: account.nit || "",
          id_cliente: account.id_cliente || "",
        });

        setOriginalData({
          numero_cuenta: account.numero_cuenta || "",
          fecha_registro: account.fecha_registro
            ? account.fecha_registro.split("T")[0]
            : "",
          nit: account.nit || "",
          id_cliente: account.id_cliente || "",
        });

        const selected = clientsRes.data.find(
          (c) => c.id === account.id_cliente
        );
        setSelectedClient(selected || null);
      } catch (error) {
        console.error(error);
        setErrorMsg("Error al cargar la información de la cuenta de pago");
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
      await handleUpdatePaymentAccountAd(id, formData);
      setShowSuccess(true);
      setTimeout(() => navigate(`/admin/cuenta/${id}`), 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        Object.entries(err.response.data.errors).forEach(
          ([field, message]) => (formattedErrors[field] = message)
        );
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(
          err.response?.data?.message ||
            "Error al actualizar la cuenta de pago"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accountData) return <SkeletonLoader />;

  return (
    <Main>
      <ProfileInfo>
        <Avatar src={accountIcon} alt="Cuenta de pago" />
        <h2>{`Cuenta #${accountData.numero_cuenta}`}</h2>
      </ProfileInfo>

      <Divider />
      <TitleHelp>Información de la cuenta de pago</TitleHelp>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Número de cuenta"
          name="numero_cuenta"
          fullWidth
          value={formData.numero_cuenta}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.numero_cuenta)}
          helperText={fieldErrors.numero_cuenta}
        />

        <TextField
          label="Fecha de registro"
          name="fecha_registro"
          type="date"
          fullWidth
          value={formData.fecha_registro}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.fecha_registro)}
          helperText={fieldErrors.fecha_registro}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="NIT"
          name="nit"
          fullWidth
          value={formData.nit}
          onChange={handleInputChange}
          error={Boolean(fieldErrors.nit)}
          helperText={fieldErrors.nit}
        />

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
              id_cliente: newValue ? newValue.id : "",
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente asociado"
              placeholder="Buscar por ID o nombre"
              error={Boolean(fieldErrors.id_cliente)}
              helperText={fieldErrors.id_cliente}
            />
          )}
        />

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
            ¡Cuenta de pago actualizada exitosamente!
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
          <Button
            type="button"
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
        </ContainerButton>
      </Form>
    </Main>
  );
};
