import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import useItemsPerPage from "../../hooks/useItemPerPage";

const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow-x: auto;

  @media (max-width: 1280px) {
    margin-top: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  th {
    background-color: #bbdefb;
    text-align: center;
    padding: 10px;
    font-size: 14px;
    color: #000;

    @media (max-width: 1280px) {
      padding: 6px;
      font-size: 12px;
    }
  }

  td {
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    color: #555;

    @media (max-width: 1280px) {
      padding: 6px;
      font-size: 12px;
    }
  }
`;

const ActionButton = styled.button`
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  margin: 0 4px;
  background-color: ${(props) => (props.delete ? "#e53935" : "#009688")};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 1280px) {
    padding: 3px 6px;
    font-size: 11px;
    margin: 0 2px;
  }
`;

const EstadoHerramientaBadge = styled.span`
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  text-transform: capitalize;
  color: white;
  background-color: ${(props) =>
    props.estado === "activo" ? "#4CAF50" : "#F44336"};
  box-shadow: 0 3px 6px
    ${(props) =>
      props.estado === "activo"
        ? "rgba(76, 175, 80, 0.4)"
        : "rgba(244, 67, 54, 0.4)"};
  border: none;
  letter-spacing: 0.3px;

  @media (max-width: 1280px) {
    padding: 3px 12px;
    font-size: 11px;
  }
`;

const ResultMessage = styled.p`
  text-align: center;
  color: #555;
  margin-top: 10px;
  font-size: 14px;

  @media (max-width: 1280px) {
    font-size: 12px;
    margin-top: 8px;
  }
`;



const ListInventoryAd = ({ inventory }) => {
  const ITEMS_PER_PAGE = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return inventory.slice(start, start + ITEMS_PER_PAGE);
  }, [inventory, currentPage]);

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Estado de la herramienta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTools.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "20px", color: "#777" }}>
                  No hay herramientas registradas
                </td>
              </tr>
            ) : (
              paginatedTools.map((tool, index) => (
                <tr key={index}>
                  <td>{tool.codigo || "—"}</td>
                  <td>{tool.nombre || "Sin nombre"}</td>
                  <td>{tool.categoria || "—"}</td>
                  <td>{tool.cantidad_disponible || 0}</td>
                  <td>{tool.estado || "—"}</td>
                  <td>                      
                    <EstadoHerramientaBadge estado={tool.estado_herramienta}>
                        {tool.estado_herramienta}
                    </EstadoHerramientaBadge></td>
                  <td>
                    <Link
                      to={`/admin/editar-inventario/${tool.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <ActionButton>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </ActionButton>
                    </Link>
                    <ActionButton delete>
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {inventory.length > 0 && (
        <>
          <ResultMessage>
            Mostrando {paginatedTools.length} resultado
            {paginatedTools.length > 1 ? "s" : ""} de búsqueda
          </ResultMessage>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            sx={{
              marginTop: "1.25rem", /* ≈20px */
              display: "flex",
              justifyContent: "center",

              "& .MuiPaginationItem-root": {
                fontSize: "0.875rem",   /* ≈14px normal */
                minWidth: "2.25rem",    /* ≈36px */
                height: "2.25rem",
              },

              "@media (max-width: 1280px)": {
                "& .MuiPaginationItem-root": {
                  fontSize: "0.6875rem", /* ≈11px */
                  minWidth: "1.75rem",   /* ≈28px */
                  height: "1.75rem",
                  margin: "0 0.125rem",  /* ≈2px entre botones */
                },
              },
            }}
          />

        </>
      )}
    </>
  );
};

export default ListInventoryAd;
