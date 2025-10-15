import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import { handleGetAccounting } from "../../controllers/administrator/getAccountingAd.controller";
import { handleChangeStateAccounting } from "../../controllers/administrator/updateStateAccounting.controller";

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
  border-radius: 50%;
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

const Correo = styled.a`
  color: #1976d2;
  text-decoration: none;
`;

const Footer = styled.div`
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
    <Skeleton variant="text" width={200} height={30} style={{ marginTop: '1rem' }} />
    <DetailsSkeleton>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
    </DetailsSkeleton>
    <SkeletonButton variant="rectangular" width={250} height={36} sx={{ marginTop: "1rem" }} />
  </Container>
);

export const UserProfileAccountingAd = () => {
  const { id } = useParams();
  const [accountingData, setAccountingData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchAccounting = async () => {
      try {
        const response = await handleGetAccounting(id);
        setAccountingData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del contable:", error);
      }
    };

    fetchAccounting();
  }, [id]);

  if (!accountingData) {
    return <SkeletonLoader />;
  }

  const handleToggleState = async () => {
    const newState = accountingData.estado === "activo" ? "inactivo" : "activo";
    try {
      await handleChangeStateAccounting(id, newState);
      setAccountingData(prev => ({ ...prev, estado: newState }));
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const confirmationMessage =
    accountingData.estado === "activo"
      ? "¿Quieres deshabilitar este contador?"
      : "¿Quieres habilitar este contador?";

  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="contador"
          />
          <Nombre>{accountingData.nombre} {accountingData.apellido}</Nombre>
        </UsuarioInfo>

        <Button
          variant="contained"
          onClick={() => setShowConfirmation(true)}
          color={accountingData.estado === "activo" ? "error" : "success"}
          style={{ alignSelf: "end", marginRight: "4rem", width: "200px" }}
        >
          {accountingData.estado === "activo" ? "DESHABILITAR" : "HABILITAR"}
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label style={{ marginBottom: "30px" }}>Información personal</Label>

        <Label>Cédula:</Label>
        <Texto>{accountingData.numero_de_cedula?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Texto>

        <Label>Nombre:</Label>
        <Texto>{accountingData.nombre}</Texto>

        <Label>Apellido:</Label>
        <Texto>{accountingData.apellido}</Texto>

        <Label>Teléfono:</Label>
        <Texto>{accountingData.telefono}</Texto>

        <Label>Correo electrónico:</Label>
        <Correo href={`mailto:${accountingData.correo_electronico}`}>
          {accountingData.correo_electronico}
        </Correo>
      </Seccion>

      <Footer>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "15rem" }}
          LinkComponent={Link}
          to={`/admin/editar-contador/${id}`}
        >
          EDITAR
        </Button>
      </Footer>

      {showConfirmation && (
        <ScreenConfirmation
          onConfirm={handleToggleState}
          onCancel={() => setShowConfirmation(false)}
          message={confirmationMessage}
        />
      )}
    </Container>
  );
};
