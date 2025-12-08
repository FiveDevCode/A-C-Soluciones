import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import ListClientAd from "../../components/administrator/ListClientAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterClientAd from "../../components/administrator/FilterClientAd";
import { handleDeleteClientAd } from "../../controllers/administrator/deleteClientAd.controller";
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
  box-shadow: 0 2px 0 rgba(0,0,0,0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const ClientPageAd = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading: loading, reload: loadClients } = useDataCache(
    'clients_cache',
    handleGetListClient
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadClients, 3, 'clients');
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un registro para deshabilitar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteClientAd(id);
      }
      showToast(`${selectedIds.length} cliente(s) deshabilitado(s) correctamente`, "success", 4000);
      setSelectedIds([]);
      loadClients();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      showToast("Error al deshabilitar los clientes", "error", 5000);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleCreateFixedClient = () => {
    navigate('/admin/clientes/crear-fijo');
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="CLIENTES"
        sectionTitle="Lista de clientes"
        secondaryLabel="Crear Cliente Fijo"
        secondaryIcon={<FaUserPlus />}
        onSecondaryAction={handleCreateFixedClient}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Deshabilitando clientes..."
        actionType="Deshabilitar seleccionados"
        lastUpdateTime={timeAgo}
        filterComponent={
          <FilterClientAd
            clients={clients}
            onFilteredChange={setFilteredClients}
          />
        }
      />

      <Card>
        <ListClientAd
          clients={filteredClients}
          reloadData={loadClients}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
        />
      </Card>

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de deshabilitar ${selectedIds.length} cliente${selectedIds.length > 1 ? 's' : ''}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default ClientPageAd;
