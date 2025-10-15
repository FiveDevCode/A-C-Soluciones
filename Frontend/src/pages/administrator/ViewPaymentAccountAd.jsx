import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import accountLogo from "../../assets/administrator/registerPaymentAccount.png";
import { handleGetPaymentAccountAd } from "../../controllers/administrator/getPaymentAccountAd.controller";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import { handleDeletePaymentAccount } from "../../controllers/administrator/deletePaymentAccountAd.controller";

// === Estilos ===
const Container = styled.div`
  padding: 2rem;
  width: 900px;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const UsuarioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Imagen = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 5%;
`;

const Nombre = styled.h3`
  margin: 0;
  color: black;
`;

const Divider = styled.hr`
  margin: 2rem 0;
`;

const Seccion = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.p`
  font-weight: bold;
  margin: 0.5rem 0 0.2rem;
  color: black;
`;

const Texto = styled.p`
  margin: 0;
  color: black;
`;

const Footer = styled.div`
  display: flex;
  gap: 1rem;
  text-align: left;
`;

const SkeletonButton = styled(Skeleton)`
  align-self: flex-end;
  &.MuiSkeleton-root {
    margin-right: 4rem;
  }
`;

const DetailsSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

// === Skeleton Loader ===
const SkeletonLoader = () => (
  <Container>
    <Header>
      <UsuarioInfo>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="text" width={300} height={40} />
      </UsuarioInfo>
      <SkeletonButton variant="rectangular" width={150} height={36} />
    </Header>
    <Divider />
    <Skeleton variant="text" width={200} height={30} style={{ marginTop: "1rem" }} />
    <DetailsSkeleton>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
    </DetailsSkeleton>
  </Container>
);

export const ViewPaymentAccountAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);
  const [clientName, setClientName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null); // "delete"

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await handleGetPaymentAccountAd(id);
        const account = response.data;
        setAccountData(account);

        if (account.id_cliente) {
          const clientResponse = await handleGetClient(account.id_cliente);
          setClientName(clientResponse.data.nombre);
          setLastName(clientResponse.data.apellido);
        }
      } catch (error) {
        console.error("Error al obtener la cuenta o el cliente:", error);
      }
    };

    fetchAccount();
  }, [id]);

  if (!accountData) return <SkeletonLoader />;


  const confirmationMessage =
    confirmationType === "delete"
      ? "¿Estás seguro de que quieres eliminar esta cuenta de pago? Esta acción no se puede deshacer."
      : "";

  const handleConfirm = async () => {
    if (confirmationType === "delete") {
      try {
        await handleDeletePaymentAccount(id);
        navigate("/admin/cuentas");
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen src={accountLogo} alt="cuenta de pago" />
          <Nombre>Cuenta N° {accountData.numero_cuenta}</Nombre>
        </UsuarioInfo>
      </Header>

      <Divider />

      <Seccion>
        <Label>Número de cuenta:</Label>
        <Texto>{accountData.numero_cuenta}</Texto>

        <Label>Fecha de registro:</Label>
        <Texto>
          {new Date(accountData.fecha_registro).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Texto>

        <Label>NIT:</Label>
        <Texto>{accountData.nit}</Texto>

        <Label>Cliente asociado:</Label>
        <Texto>{clientName + " " + lastName}</Texto>
      </Seccion>

      <Footer>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "15rem" }}
          LinkComponent={Link}
          to={`/admin/editar-cuenta/${id}`}
        >
          EDITAR
        </Button>

        <Button
          variant="contained"
          color="error"
          style={{ width: "15rem" }}
          onClick={() => {
            setConfirmationType("delete");
            setShowConfirmation(true);
          }}
        >
          ELIMINAR
        </Button>
      </Footer>

      {showConfirmation && (
        <ScreenConfirmation
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowConfirmation(false);
            setConfirmationType(null);
          }}
          message={confirmationMessage}
        />
      )}
    </Container>
  );
};

export default ViewPaymentAccountAd;
