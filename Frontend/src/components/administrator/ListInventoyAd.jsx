import styled from "styled-components";
import toolIcon from "../../assets/administrator/registerInventoryAd.png";
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

const Text = styled.h2`
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

const ListInventoryAd = ({ inventory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return inventory.slice(start, start + ITEMS_PER_PAGE);
  }, [inventory, currentPage]);

  return (
    <ContainerList>
      {paginatedTools.map((tool, index) => (
        <Item key={index}>
          <ItemDescription>
            <Logo src={toolIcon} size="100px" />
            <ItemInfo>
              <Title>
                {tool.nombre || "Sin nombre especificado"}
              </Title>
              <Description>
                Código: {tool.codigo || "No asignado"}
              </Description>
              <Text>
                Categoría: {tool.categoria || "No especificada"}
              </Text>
              <Text>
                Cantidad disponible: {tool.cantidad_disponible ?? "—"}
              </Text>
              <Text>
                Estado: {tool.estado || "—"}
              </Text>
              <Text>
                Estado herramienta: {tool.estado_herramienta || "—"}
              </Text>
            </ItemInfo>
          </ItemDescription>

          <ContainerOption>
            <Link
              to={`/admin/editar-inventario/${tool.id}`}
              style={{ textDecoration: "none" }}
            >
              <SeeMore style={{ cursor: "pointer", color: "#343875" }}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Editar</span>
              </SeeMore>
            </Link>

            <Link
              to={`/admin/inventario/${tool.id}`}
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

export default ListInventoryAd;
