import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Pagination } from "@mui/material";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import useItemsPerPage from "../../hooks/useItemPerPage";

/* ---------- 🎨 Estilos base reutilizables ---------- */
const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow-x: auto;

  @media (max-width: 1350px) {
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    overflow-x: visible;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border-spacing: 50px 0;
  
  th {
    background-color: #bbdefb;
    text-align: center;
    height: 42px;
    font-size: 14px;
    color: #000;

    @media (max-width: 1350px) {
      font-size: 12px;
    }
  }

  td {
    text-align: center;
    padding: 4px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    color: #555;
    height: 51px;

    max-width: 200px;        /* Ajusta a tu gusto */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* <-- añade los "..." automáticamente */

    @media (max-width: 1350px) {
      height: 42.5px;
      padding: 0;
      font-size: 12px;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileCardContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 4px;
  }
`;

const MobileCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  position: relative;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? '#e3f2fd' : 'white'};

  &:active {
    transform: scale(0.98);
  }
`;

const MobileCardLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const MobileCardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MobileCardLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9e9e9e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MobileCardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #212121;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileCardSubtitle = styled.div`
  font-size: 13px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileCardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const MobileActions = styled.div`
  display: flex;
  gap: 6px;
`;

const MobilePDFButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
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

  @media (max-width: 1350px) {
    padding: 3px 6px;
    font-size: 11px;
    margin: 0 2px;
  }
`;



const getBadgeStyles = (estado) => {
  const estadoLower = estado?.toLowerCase() || '';
  
  // Estados de solicitudes
  if (estadoLower === 'pendiente') {
    return { bg: '#FFA726', shadow: 'rgba(255, 167, 38, 0.4)' };
  }
  if (estadoLower === 'aprobada') {
    return { bg: '#4CAF50', shadow: 'rgba(76, 175, 80, 0.4)' };
  }
  if (estadoLower === 'rechazada') {
    return { bg: '#F44336', shadow: 'rgba(244, 67, 54, 0.4)' };
  }
  
  // Estados de visitas
  if (estadoLower === 'programada') {
    return { bg: '#2196F3', shadow: 'rgba(33, 150, 243, 0.4)' };
  }
  if (estadoLower === 'iniciada' || estadoLower === 'en_camino' || estadoLower === 'en camino') {
    return { bg: '#FF9800', shadow: 'rgba(255, 152, 0, 0.4)' };
  }
  if (estadoLower === 'completada') {
    return { bg: '#4CAF50', shadow: 'rgba(76, 175, 80, 0.4)' };
  }
  if (estadoLower === 'cancelada') {
    return { bg: '#9E9E9E', shadow: 'rgba(158, 158, 158, 0.4)' };
  }
  
  // Estados de facturas
  if (estadoLower === 'pagada') {
    return { bg: '#4CAF50', shadow: 'rgba(76, 175, 80, 0.4)' };
  }
  if (estadoLower === 'vencida') {
    return { bg: '#F44336', shadow: 'rgba(244, 67, 54, 0.4)' };
  }
  
  // Estados generales (activo/inactivo)
  if (estadoLower === 'activo') {
    return { bg: '#4CAF50', shadow: 'rgba(76, 175, 80, 0.4)' };
  }
  if (estadoLower === 'inactivo') {
    return { bg: '#F44336', shadow: 'rgba(244, 67, 54, 0.4)' };
  }
  
  // Default
  return { bg: '#9E9E9E', shadow: 'rgba(158, 158, 158, 0.4)' };
};

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 6px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  text-transform: capitalize;
  color: white;
  background-color: ${(props) => getBadgeStyles(props.estado).bg};
  box-shadow: 0 3px 6px ${(props) => getBadgeStyles(props.estado).shadow};
  border: none;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${(props) => getBadgeStyles(props.estado).shadow};
  }

  @media (max-width: 1350px) {
    padding: 3px 12px;
    font-size: 11px;
  }
`;

const ResultMessage = styled.p`
  text-align: center;
  color: #555;
  margin-top: 10px;
  font-size: 14px;

  @media (max-width: 1350px) {
    font-size: 12px;
    margin-top: 8px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
`;

const LoadingContent = styled.div`
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SkeletonRow = styled.tr`
  td {
    padding: 12px 4px !important;
  }
`;

const SkeletonCell = styled.div`
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto;
  width: ${props => props.width || '80%'};

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const TableLoadingIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  color: #667eea;
`;

const SmallSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/* ---------- 🧩 Componente BaseTable ---------- */
const BaseTable = ({
  data = [],
  columns = [],
  getBadgeValue,
  emptyMessage = "No hay registros disponibles",
  EditComponent,
  ViewComponent,
  onSelectRows, // <-- sigue funcionando individualmente
  isLoadingData = false, // <-- prop para saber si está cargando
  mobileConfig = {}, // <-- configuración para vista móvil: { title, subtitle, renderExtra }
}) => {
  const ITEMS_PER_PAGE = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedViewRow, setSelectedViewRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  
  // Mostrar skeleton solo si realmente estamos cargando Y no hay datos
  const isLoadingTable = isLoadingData && data.length === 0;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const handleSelectRow = (row) => {
    if (!onSelectRows) return; 
    setSelectedRows((prev) =>
      prev.includes(row)
        ? prev.filter((r) => r !== row)
        : [...prev, row]
    );
  };

  useEffect(() => {
    if (onSelectRows) {
      onSelectRows(selectedRows);
    }
  }, [selectedRows]);

  const handleCloseEdit = () => {
    setSelectedRow(null);
    setIsLoading(false);
    setShowModal(false);
  };

  const handleCloseView = () => {
    setSelectedViewRow(null);
    setShowModal(false);
  };

  const handleOpenEdit = async (row) => {
    setIsLoading(true);
    setShowModal(false);
    setSelectedRow(row);
    
    // Mostrar pantalla de carga por 1.5 segundos, luego mostrar el modal
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 1500);
  };

  const handleOpenView = async (row) => {
    // Ver detalle se abre inmediatamente sin pantalla de carga
    setSelectedViewRow(row);
    setShowModal(true);
  };

  const handleModalReady = () => {
    // Ya no hace nada porque ahora el tiempo mínimo se controla en handleOpenEdit
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  return (
    <>
      <TableContainer style={{ position: 'relative' }}>
        {/* Vista Desktop/Tablet - Tabla Normal */}
        <Table>
          <thead>
            <tr>
              <th>
                {onSelectRows && selectedRows.length > 0 ? (
                  <Checkbox
                    icon={<IndeterminateCheckBoxIcon />}
                    checkedIcon={<IndeterminateCheckBoxIcon />}
                    color="error"
                    onChange={handleClearSelection}
                    title={`Desmarcar todo (${selectedRows.length} seleccionados)`}
                  />
                ) : null}
              </th>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              {(EditComponent || ViewComponent) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {isLoadingTable ? (
              // Mostrar skeleton loader mientras carga
              [...Array(5)].map((_, index) => (
                <SkeletonRow key={index}>
                  <td><SkeletonCell width="60%" /></td>
                  {columns.map((_, i) => (
                    <td key={i}><SkeletonCell /></td>
                  ))}
                  {(EditComponent || ViewComponent) && (
                    <td><SkeletonCell width="70%" /></td>
                  )}
                </SkeletonRow>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ padding: "20px", color: "#777" }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={index}
                  style={{
                    backgroundColor: selectedRows.includes(row) ? '#e0e0e0' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <td>
                    {onSelectRows ? (
                      <Checkbox
                        color="primary"
                        checked={selectedRows.includes(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    ) : (
                      null
                    )}
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
                    return (
                        <td key={i}>
                          {value
                            ? value.length > 50
                              ? value.substring(0, 50) + "..."
                              : value
                            : "—"}
                        </td>
                      );
                  })}
                  {(EditComponent || ViewComponent) && (
                    <td>
                      {ViewComponent && (
                        <ActionButton
                          view
                          onClick={() => handleOpenView(row)}
                        >
                          <FontAwesomeIcon icon={faEye} /> Ver
                        </ActionButton>
                      )}
                      {EditComponent && (
                        <ActionButton onClick={() => handleOpenEdit(row)}>
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </ActionButton>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Vista Móvil - Tarjetas */}
        <MobileCardContainer>
          {isLoadingTable ? (
            [...Array(3)].map((_, index) => (
              <MobileCard key={index}>
                <MobileCardLeft>
                  <SkeletonCell width="80%" />
                  <SkeletonCell width="60%" />
                </MobileCardLeft>
                <MobileCardRight>
                  <SkeletonCell width="60px" />
                </MobileCardRight>
              </MobileCard>
            ))
          ) : paginatedData.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#777" }}>
              {emptyMessage}
            </div>
          ) : (
            paginatedData.map((row, index) => {
              // Función para formatear valores
              const formatValue = (value) => {
                if (!value) return "—";
                
                // Si es un objeto (como cliente)
                if (typeof value === 'object' && value !== null) {
                  const fullName = `${value.nombre || ""} ${value.apellido || ""}`.trim();
                  return fullName || "Sin nombre";
                }
                
                // Si parece una fecha ISO
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
                  const date = new Date(value);
                  return date.toLocaleDateString("es-CO");
                }
                
                // Si es un string muy largo, truncar
                if (typeof value === 'string' && value.length > 40) {
                  return value.slice(0, 40) + "...";
                }
                
                return value;
              };

              const titleValue = mobileConfig.title ? row[mobileConfig.title] : row[columns[0]?.accessor];
              const subtitleValue = mobileConfig.subtitle ? row[mobileConfig.subtitle] : row[columns[1]?.accessor];
              
              const title = formatValue(titleValue);
              const subtitle = formatValue(subtitleValue);
              const badgeValue = getBadgeValue ? getBadgeValue(row) : row.estado;

              // Obtener labels de las columnas
              const titleColumn = columns.find(col => col.accessor === mobileConfig.title) || columns[0];
              const subtitleColumn = columns.find(col => col.accessor === mobileConfig.subtitle) || columns[1];
              
              const titleLabel = mobileConfig.titleLabel || titleColumn?.header || "Información";
              const subtitleLabel = mobileConfig.subtitleLabel || subtitleColumn?.header || "Detalle";

              return (
                <MobileCard 
                  key={index}
                  isSelected={selectedRows.includes(row)}
                  onClick={() => onSelectRows && handleSelectRow(row)}
                >
                  <MobileCardLeft>
                    <MobileCardRow>
                      <MobileCardLabel>{titleLabel}</MobileCardLabel>
                      <MobileCardTitle>{title}</MobileCardTitle>
                    </MobileCardRow>
                    <MobileCardRow>
                      <MobileCardLabel>{subtitleLabel}</MobileCardLabel>
                      <MobileCardSubtitle>{subtitle}</MobileCardSubtitle>
                    </MobileCardRow>
                  </MobileCardLeft>
                  <MobileCardRight>
                    {badgeValue && (
                      <EstadoBadge estado={badgeValue}>
                        {badgeValue}
                      </EstadoBadge>
                    )}
                    {/* Renderizado personalizado extra (para botones PDF, etc.) */}
                    {mobileConfig.renderExtra && mobileConfig.renderExtra(row)}
                    
                    <MobileActions>
                      {ViewComponent && (
                        <ActionButton
                          view
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenView(row);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} /> Ver
                        </ActionButton>
                      )}
                      {EditComponent && (
                        <ActionButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(row);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </ActionButton>
                      )}
                    </MobileActions>
                  </MobileCardRight>
                </MobileCard>
              );
            })
          )}
        </MobileCardContainer>
      </TableContainer>

      {data.length > 0 && (
        <>
          <ResultMessage>
            Mostrando {paginatedData.length} de {data.length} resultado
            {data.length !== 1 ? "s" : ""}
          </ResultMessage>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.25rem",
              "@media (max-width: 1350px)": {
                "& .MuiPaginationItem-root": {
                  fontSize: "0.75rem",
                },
              },
            }}
          />
        </>
      )}

      {isLoading && (
        <LoadingOverlay>
          <LoadingContent>
            <Spinner />
            <LoadingText>Cargando datos...</LoadingText>
          </LoadingContent>
        </LoadingOverlay>
      )}

      {EditComponent && selectedRow && showModal && (
        <EditComponent
          selected={selectedRow}
          onClose={handleCloseEdit}
          onSuccess={() => {
            handleCloseEdit();
            window.location.reload();
          }}
          onReady={handleModalReady}
        />
      )}
      {ViewComponent && selectedViewRow && showModal && (
        <ViewComponent
          selected={selectedViewRow}
          onClose={handleCloseView}
          onReady={handleModalReady}
        />
      )}
    </>
  );
};

export default BaseTable;
