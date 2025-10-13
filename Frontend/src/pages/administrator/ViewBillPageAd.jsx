import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import billLogo from "../../assets/administrator/bill-view.png"; // Usa el ícono que tengas para facturas
import { handleGetBillAd } from "../../controllers/administrator/getBillAd.controller";
import { handleChangeStateBill } from "../../controllers/administrator/updateStateBillAd.controller";

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
    <Skeleton variant="text" width={200} height={30} style={{ marginTop: "1rem" }} />
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

export const ViewBillPageAd = () => {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await handleGetBillAd(id);
        setBillData(response.data.data);
      } catch (error) {
        console.error("Error al obtener la factura:", error);
      }
    };

    fetchBill();
  }, [id]);

  if (!billData) {
    return <SkeletonLoader />;
  }

  const handleToggleState = async () => {
    const newState =
      billData.estado_factura === "pagada" ? "pendiente" : "pagada";
    try {
      await handleChangeStateBill(id, newState);
      setBillData((prev) => ({ ...prev, estado_factura: newState }));
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const confirmationMessage =
    billData.estado_factura === "pagada"
      ? "¿Quieres marcar esta factura como pendiente?"
      : "¿Quieres marcar esta factura como pagada?";

  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen src={billLogo} alt="factura" />
          <Nombre>Factura N° {billData.numero_factura}</Nombre>
        </UsuarioInfo>

        <Button
          variant="contained"
          onClick={() => setShowConfirmation(true)}
          color={
            billData.estado_factura === "pagada" ? "error" : "success"
          }
          style={{
            alignSelf: "end",
            marginRight: "4rem",
            width: "200px",
          }}
        >
          {billData.estado_factura === "pagada"
            ? "MARCAR PENDIENTE"
            : "MARCAR PAGADA"}
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label>Concepto:</Label>
        <Texto>{billData.concepto}</Texto>

        <Label>Fecha de factura:</Label>
        <Texto>
          {new Date(billData.fecha_factura).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Texto>

        <Label>Fecha de vencimiento:</Label>
        <Texto>
          {new Date(billData.fecha_vencimiento).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Texto>

        <Label>Monto facturado:</Label>
        <Texto>${Number(billData.monto_facturado).toFixed(2)}</Texto>

        <Label>Abonos:</Label>
        <Texto>
          {billData.abonos
            ? `$${Number(billData.abonos).toFixed(2)}`
            : "Sin abonos"}
        </Texto>

        <Label>Saldo pendiente:</Label>
        <Texto>${Number(billData.saldo_pendiente).toFixed(2)}</Texto>

        <Label>Estado actual:</Label>
        <Texto
          style={{
            fontWeight: "bold",
            color:
              billData.estado_factura === "pagada"
                ? "green"
                : billData.estado_factura === "vencida"
                ? "red"
                : "#d1a000",
          }}
        >
          {billData.estado_factura}
        </Texto>
      </Seccion>

      <Footer>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "15rem" }}
          LinkComponent={Link}
          to={`/admin/editar-factura/${id}`}
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

export default ViewBillPageAd;
