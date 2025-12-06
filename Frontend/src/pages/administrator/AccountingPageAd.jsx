import { useState } from "react";
import styled from "styled-components";
import { handleGetListAccountingAd } from "../../controllers/administrator/getListAccountingAd.controller";
import ListAccountingAd from "../../components/administrator/ListAccountingAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FilterAccountingAd from "../../components/administrator/FilterAccountingAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateAccountingAd from "../../components/administrator/FormCreateAccountingAd";
import { handleDeleteAccountingAd } from "../../controllers/administrator/deleteAccountingAd.controller";
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

const AccountingPageAd = () => {
  const { data: accountings, isLoading: loading, reload: loadAccounting } = useDataCache(
    'accounting_cache',
    handleGetListAccountingAd
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadAccounting, 3);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredAccounting, setFilteredAccounting] = useState([]);
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
        await handleDeleteAccountingAd(id);
      }
      showToast(`${selectedIds.length} empleado(s) deshabilitado(s) correctamente`, "success", 4000);
      setSelectedIds([]);
      loadAccounting();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      showToast("Error al deshabilitar los empleados", "error", 5000);
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
        headerTitle="CONTABILIDAD"
        sectionTitle="Lista de empleados contables"
        addLabel="Agregar empleado contable"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Deshabilitando empleados..."
        actionType="Deshabilitar seleccionados"
        filterComponent={
          <FilterAccountingAd
            accountings={accountings}
            onFilteredChange={setFilteredAccounting}
          />
        }
      />

      <Card>
        <ListAccountingAd
          accountings={filteredAccounting}
          reloadData={loadAccounting}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
        />
      </Card>

      {showModal && (
        <FormCreateAccountingAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAccounting();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de que desea deshabilitar ${selectedIds.length} registro(s)? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default AccountingPageAd;
