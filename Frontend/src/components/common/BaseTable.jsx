import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Button, Pagination } from "@mui/material";
import useItemsPerPage from "../../hooks/useItemPerPage";

/* ---------- 🎨 Estilos base reutilizables ---------- */
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
      padding: 0;
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

const EstadoBadge = styled.span`
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

const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 1280px) {
    flex-direction: column;
    gap: 5px;
    align-items: stretch;

    button {
      width: 100%;
      font-size: 12px;
    }
  }
`;

/* ---------- 🧩 Componente BaseTable ---------- */
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
  const [selectedRows, setSelectedRows] = useState([]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const handleSelectRow = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row)
        ? prev.filter((r) => r !== row)
        : [...prev, row]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(paginatedData);
    } else {
      setSelectedRows([]);
    }
  };

  const handleDeleteSelected = () => {
    if (onDelete && selectedRows.length > 0) {
      onDelete(selectedRows);
      setSelectedRows([]);
    }
  };

  const handleCloseEdit = () => setSelectedRow(null);

  return (
    <>
      {/* 🔸 Barra de acciones */}
      {selectedRows.length > 0 && (
        <ActionsBar>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} />}
            onClick={handleDeleteSelected}
          >
            Eliminar seleccionados ({selectedRows.length})
          </Button>
        </ActionsBar>
      )}

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>
                <Checkbox
                  color="primary"
                  onChange={handleSelectAll}
                  checked={
                    selectedRows.length > 0 &&
                    selectedRows.length === paginatedData.length
                  }
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < paginatedData.length
                  }
                />
              </th>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              {EditComponent && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  style={{ padding: "20px", color: "#777" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                    />
                  </td>
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
                  {EditComponent && (
                    <td>
                      <ActionButton onClick={() => setSelectedRow(row)}>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </ActionButton>
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

      {EditComponent && selectedRow && (
        <EditComponent
          selectedTool={selectedRow}
          onClose={handleCloseEdit}
          onSuccess={() => {
            handleCloseEdit();
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default BaseTable;
