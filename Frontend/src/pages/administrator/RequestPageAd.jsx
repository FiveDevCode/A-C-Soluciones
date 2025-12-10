import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import ListRequestAd from "../../components/administrator/ListRequestAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterRequestsAd from "../../components/administrator/FilterRequestsAd";
import { handleDeleteRequestAd } from "../../controllers/administrator/deleteRequestAd.controller";
import useDataCache from "../../hooks/useDataCache";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { useToastContext } from "../../contexts/ToastContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const RequestPageAd = () => {
  const { data: requests, isLoading: loading, reload: loadRequests } = useDataCache(
    'requests_cache',
    async () => {
      const res = await handleGetListRequest();
      return res.data;
    }
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadRequests, 3, 'requests');
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const { showToast } = useToastContext();

  const handleSelectRows = (rows) => {
    // Extraer solo los IDs de los objetos seleccionados
    const ids = rows.map(row => row.id);
    setSelectedIds(ids);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una solicitud para eliminar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteRequestAd(id);
      }
      const cantidad = selectedIds.length;

      const texto = cantidad === 1
        ? "1 solicitud eliminada correctamente"
        : `${cantidad} solicitudes eliminadas correctamente`;

      showToast(texto, "success", 4000);
      setSelectedIds([]);
      setClearTrigger(prev => prev + 1);
      loadRequests();
    } catch (error) {
      showToast("Error al eliminar las solicitudes", "error", 5000);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="SOLICITUDES"
        sectionTitle="Listado de solicitudes de servicio"
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Eliminando solicitudes..."
        actionType="Eliminar seleccionados"
        filterComponent={
          <FilterRequestsAd
            requests={requests}
            onFilteredChange={setFilteredRequests}
          />
        }
      />

      <Card>
        <ListRequestAd
          requests={filteredRequests}
          onSelectRows={handleSelectRows}
          isLoadingData={loading}
          clearSelectionTrigger={clearTrigger}
          onUpdate={loadRequests}
        />
      </Card>

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de eliminar ${selectedIds.length} solicitud${selectedIds.length > 1 ? 'es' : ''}? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default RequestPageAd;
