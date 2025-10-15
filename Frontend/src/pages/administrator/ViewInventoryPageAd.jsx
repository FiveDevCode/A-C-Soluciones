import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import toolLogo from "../../assets/administrator/registerInventoryAd.png";
import { handleGetInventoryAd } from "../../controllers/administrator/getInventoryAd.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";

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

const ItemInfo = styled.div`
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
      <ItemInfo>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="text" width={300} height={40} />
      </ItemInfo>
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

export const ViewInventoryPageAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toolData, setToolData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await handleGetInventoryAd(id);
        setToolData(response.data);
      } catch (error) {
        console.error("Error al obtener la herramienta:", error);
      }
    };

    fetchTool();
  }, [id]);

  if (!toolData) return <SkeletonLoader />;

  const confirmationMessage =
    confirmationType === "delete"
      ? "¿Estás seguro de que quieres eliminar esta herramienta del inventario? Esta acción no se puede deshacer."
      : "";

  const handleConfirm = async () => {
    if (confirmationType === "delete") {
      try {
        await handleDeleteInventoryAd(id);
        navigate("/admin/inventario");
      } catch (error) {
        console.error("Error al eliminar la herramienta:", error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <ItemInfo>
          <Imagen src={toolLogo} alt="herramienta" />
          <Nombre>{toolData.nombre}</Nombre>
        </ItemInfo>
      </Header>

      <Divider />

      <Seccion>
        <Label>Código:</Label>
        <Texto>{toolData.codigo}</Texto>

        <Label>Categoría:</Label>
        <Texto>{toolData.categoria}</Texto>

        <Label>Cantidad disponible:</Label>
        <Texto>{toolData.cantidad_disponible}</Texto>

        <Label>Estado:</Label>
        <Texto>{toolData.estado}</Texto>

        <Label>Estado herramienta:</Label>
        <Texto>{toolData.estado_herramienta}</Texto>

        {toolData.id_administrador && (
          <>
            <Label>ID Administrador:</Label>
            <Texto>{toolData.id_administrador}</Texto>
          </>
        )}

        {toolData.id_contabilidad && (
          <>
            <Label>ID Contabilidad:</Label>
            <Texto>{toolData.id_contabilidad}</Texto>
          </>
        )}
      </Seccion>

      <Footer>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "15rem" }}
          LinkComponent={Link}
          to={`/admin/editar-inventario/${id}`}
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

export default ViewInventoryPageAd;
