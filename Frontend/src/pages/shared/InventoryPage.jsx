import { useState } from "react";
import styled from "styled-components";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import ListInventoryAd from "../../components/administrator/ListInventoyAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleDeleteInventory } from "../../controllers/administrator/deleteInventoryAd.controller";
import FilterInventoryAd from "../../components/administrator/FilterInventoryAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateInventoryAd from "../../components/administrator/FormCreateInventoryAd";
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

const InventoryPage = () => {
  const { data: inventory, isLoading: loading, reload: loadInventory } = useDataCache(
    'inventory_cache',
    handleGetListInventoryAd
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadInventory, 3, 'inventory');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
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
        await handleDeleteInventory(id);
      }
      showToast(`${selectedIds.length} herramientas deshabilitadas correctamente`, "success", 4000);
      setSelectedIds([]);
      setClearTrigger(prev => prev + 1);
      loadInventory();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      showToast("Error al deshabilitar las herramientas", "error", 5000);
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
        headerTitle="HERRAMIENTAS"
        sectionTitle="Gestión de herramientas"
        addLabel="Agregar herramienta"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Deshabilitando herramientas..."
        actionType="Deshabilitar seleccionados"
        filterComponent={
          <FilterInventoryAd
            inventory={inventory}
            onFilteredChange={setFilteredInventory}
          />
        }
      />


      <Card>
        <ListInventoryAd
          inventory={filteredInventory}
          reloadData={loadInventory}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
          clearSelectionTrigger={clearTrigger}
        />
      </Card>

      {showModal && (
        <FormCreateInventoryAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadInventory();
          }}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de deshabilitar ${selectedIds.length} herramienta${selectedIds.length > 1 ? 's' : ''}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default InventoryPage;
