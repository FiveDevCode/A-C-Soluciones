import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListAdministratorAd from "../../components/administrator/ListAdministratorAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateAdministratorAd from "../../components/administrator/FormCreateAdministratorAd";
import { handleGetListAdministrator } from "../../controllers/administrator/getAdministratorListAd.controller";
import { handleDeleteAdministratorAd } from "../../controllers/administrator/deleteAdministratorAd.controller";
import FilterAdministratorAd from "../../components/administrator/FilterAdministratorAd";
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

const AdministratorPageAd = () => {
  const { data: administrators, isLoading: loading, reload: loadAdministrators } = useDataCache(
    'administrators_cache',
    async () => {
      const res = await handleGetListAdministrator();
      return res.data;
    }
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadAdministrators, 3, 'administrators');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un administrador para deshabilitar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteAdministratorAd(id);
      }
      const cantidad = selectedIds.length;

      const texto = cantidad === 1
        ? "1 administrador eliminado correctamente"
        : `${cantidad} administradores eliminados correctamente`;

      showToast(texto, "success", 4000);
      setSelectedIds([]);
      setClearTrigger(prev => prev + 1);
      loadAdministrators();
    } catch (error) {
      console.error("Error deshabilitando administradores:", error);
      showToast("Error al deshabilitar los administradores", "error", 5000);
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
        headerTitle="ADMINISTRADORES"
        sectionTitle="Listado de administradores del sistema"
        addLabel="Agregar administrador"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Deshabilitando administradores seleccionados..."
        actionType="Deshabilitar seleccionados"
        filterComponent={
          <FilterAdministratorAd
            administrators={administrators}
            onFilteredChange={setFilteredAdministrators}
          />
        }
      />

      <Card>
        <ListAdministratorAd
          administrators={filteredAdministrators}
          reloadData={loadAdministrators}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
          clearSelectionTrigger={clearTrigger}
        />
      </Card>

      {showModal && (
        <FormCreateAdministratorAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAdministrators();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de deshabilitar ${selectedIds.length} administrador${selectedIds.length > 1 ? 'es' : ''}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default AdministratorPageAd;
