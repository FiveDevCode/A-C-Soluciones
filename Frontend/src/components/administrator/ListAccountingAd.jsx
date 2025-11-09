import styled from "styled-components";
import accountingImg from "../../assets/accountant/accountingEmployee.png"; 
import Logo from "../common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
import { useMemo, useState } from "react";

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 1rem 2rem;
  justify-content: space-between;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }
`;

const ItemDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemInfo = styled.div`
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

const Title = styled.h2`
  font-size: 1rem;
  font-weight: lighter;
`;

const Description = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const Role = styled.h2`
  font-size: 0.95rem;
  font-weight: normal;
  color: #555;
`;

const Email = styled.h2`
  font-size: 0.9rem;
  font-weight: normal;
  color: #666;
`;

const SeeMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ITEMS_PER_PAGE = 4;

const ListAccountingAd = ({ accountings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(accountings.length / ITEMS_PER_PAGE);

  const paginatedAccountings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return accountings.slice(start, start + ITEMS_PER_PAGE);
  }, [accountings, currentPage]);

  return (
    <ContainerList>
      {paginatedAccountings.map((employee, index) => (
        <Item key={index}>
          <ItemDescription>
            <Logo src={accountingImg} size="100px" />
            <ItemInfo>
              <Title>
                Cédula: {employee.numero_de_cedula || "No especificada"}
              </Title>
              <Description>
                {employee.nombre} {employee.apellido}
              </Description>
              <Role>{employee.cargo || "Contable"}</Role>
              <Email>{employee.correo_electronico}</Email>
            </ItemInfo>
          </ItemDescription>

          <ContainerOption>
            <Link
              to={`/admin/editar-contador/${employee.id}`}
              style={{ textDecoration: "none" }}
            >
              <SeeMore style={{ cursor: "pointer", color: "#343875" }}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Editar</span>
              </SeeMore>
            </Link>

            <Link
              to={`/admin/perfil-contador/${employee.id}`}
              style={{ textDecoration: "none" }}
            >
              <SeeMore style={{ cursor: "pointer", color: "#343875" }}>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Ver</span>
              </SeeMore>
            </Link>
          </ContainerOption>
        </Item>
      ))}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        color="primary"
        shape="rounded"
        sx={{ marginTop: "3rem", alignSelf: "center" }}
      />
    </ContainerList>
  );
};

export default ListAccountingAd;
