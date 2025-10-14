import styled from "styled-components";
import billIcon from "../../assets/administrator/billIcon.png"; 
import Logo from "../common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
import { useMemo, useState } from "react";

const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
`;

const Notification = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid rgba(0,0,0,0.25);
  padding: 1rem 2rem;
  justify-content: space-between;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContainerOption = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  align-self: center;
`;

const EstadoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
`;

const EstadoLabel = styled.span`
  font-weight: bold;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

const EstadoBubble = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  color: white;
  background-color: ${props =>
    props.estado === "pagada"
      ? "green"
      : props.estado === "vencida"
      ? "red"
      : "#d1a000"};
`;

const TitleNoti = styled.h2`
  font-size: 1rem;
  font-weight: lighter;
`;

const Description = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const Date = styled.h2`
  font-size: 0.9rem;
  font-weight: normal;
  color: #555;
`;

const SeeMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ITEMS_PER_PAGE = 4;

const ListBillAd = ({ bills }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bills.length / ITEMS_PER_PAGE);

  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return bills.slice(start, start + ITEMS_PER_PAGE);
  }, [bills, currentPage]);

  return (
    <ContainerNoti>
      {paginatedBills.map((bill, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={billIcon} size="10%" />
            <NotificationInfo>
              <TitleNoti>
                {bill.numero_factura
                  ? `Factura N° ${bill.numero_factura}`
                  : "Sin número de factura"}
              </TitleNoti>
              <Description>
                {bill.concepto && bill.concepto.length > 50
                  ? `${bill.concepto.slice(0, 50)}...`
                  : bill.concepto || "Sin concepto"}
              </Description>
              <Date>Fecha factura: {bill.fecha_factura?.substring(0, 10) || "—"}</Date>
              <Date>Vencimiento: {bill.fecha_vencimiento?.substring(0, 10) || "—"}</Date>
            </NotificationInfo>
          </NotificationDescription>

          <ContainerOption>
            {/* Estado antes de los botones */}
            <EstadoContainer>
              <EstadoLabel>Estado</EstadoLabel>
              <EstadoBubble estado={bill.estado_factura}>
                {bill.estado_factura}
              </EstadoBubble>
            </EstadoContainer>

            {/* Botones */}
            <Link
              to={`/admin/editar-factura/cd${bill.id}`}
              style={{ textDecoration: "none" }}
            >
              <SeeMore style={{ cursor: "pointer", color: "#343875" }}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Editar</span>
              </SeeMore>
            </Link>

            <Link
              to={`/admin/factura/${bill.id}`}
              style={{ textDecoration: "none" }}
            >
              <SeeMore style={{ cursor: "pointer", color: "#343875" }}>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Ver</span>
              </SeeMore>
            </Link>
          </ContainerOption>
        </Notification>
      ))}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        color="primary"
        shape="rounded"
        sx={{ marginTop: "3rem", alignSelf: "center" }}
      />
    </ContainerNoti>
  );
};

export default ListBillAd;
