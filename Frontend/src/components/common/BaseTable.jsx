import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@mui/material";
import useItemsPerPage from "../../hooks/useItemPerPage";

const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: #bbdefb;
    padding: 10px;
    font-size: 14px;
  }
  td {
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
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
`;

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  color: white;
  background-color: ${(props) =>
    props.estado === "activo" ? "#4CAF50" : "#F44336"};
`;

const ResultMessage = styled.p`
  text-align: center;
  color: #555;
  margin-top: 10px;
  font-size: 14px;
`;


const BaseTable = ({
  data = [],
  columns = [],
  onDelete,
  getBadgeValue,
  emptyMessage = "No hay registros disponibles",
  EditComponent,
}) => {
  const ITEMS_PER_PAGE = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const handleCloseEdit = () => setSelectedRow(null);

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              {(EditComponent || onDelete) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ padding: "20px", color: "#777" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col, i) => {
                    const value = row[col.accessor];
                    if (col.render) return <td key={i}>{col.render(value, row)}</td>;
                    if (getBadgeValue && col.isBadge)
                      return (
                        <td key={i}>
                          <EstadoBadge estado={getBadgeValue(row)}>
                            {getBadgeValue(row)}
                          </EstadoBadge>
                        </td>
                      );
                    return <td key={i}>{value || "—"}</td>;
                  })}
                  {(EditComponent || onDelete) && (
                    <td>
                      {EditComponent && (
                        <ActionButton onClick={() => setSelectedRow(row)}>
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </ActionButton>
                      )}
                      {onDelete && (
                        <ActionButton delete onClick={() => onDelete(row)}>
                          <FontAwesomeIcon icon={faTrash} /> Eliminar
                        </ActionButton>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {data.length > 0 && (
        <>
          <ResultMessage>
            Mostrando {paginatedData.length} resultado
            {paginatedData.length > 1 ? "s" : ""} de búsqueda
          </ResultMessage>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            sx={{
              marginTop: "1.25rem",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </>
      )}

      {/* 👇 renderiza el componente de edición si fue pasado */}
      {EditComponent && selectedRow && (
        <EditComponent
          selectedTool={selectedRow}
          onClose={handleCloseEdit}
          onSuccess={() => {
            handleCloseEdit();
            window.location.reload(); // ⚙️ aquí recarga la lista tras actualizar
          }}
        />
      )}

    </>
  );
};

export default BaseTable;