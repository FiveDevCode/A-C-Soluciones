import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleDeletePaymentAccount } from "../../controllers/administrator/deletePaymentAccountAd.controller";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import ListPaymentAccountAd from "../../components/administrator/ListPaymentAccountAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreatePaymentAccountAd from "../../components/administrator/FormCreatePaymentAccountAd";
import FilterPaymentAccountAd from "../../components/administrator/FilterPaymentAccountAd";
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

const PaymentAccountPage = () => {
  const { data: accounts, isLoading: loading, reload: loadAccounts } = useDataCache(
    'payment_accounts_cache',
    handleGetListPaymentAccountAd
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadAccounts, 3, 'accounts');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una cuenta para eliminar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeletePaymentAccount(id);
      }
      const cantidad = selectedIds.length;

      const texto = cantidad === 1
        ? "1 cuenta eliminada correctamente"
        : `${cantidad} cuentas eliminadas correctamente`;

      showToast(texto, "success", 4000);
      setSelectedIds([]);
      setClearTrigger(prev => prev + 1);
      loadAccounts();
    } catch (error) {
      showToast("Error al eliminar las cuentas", "error", 5000);
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
        headerTitle="CUENTAS DE PAGO"
        sectionTitle="Cuentas registradas"
        addLabel="Agregar cuenta"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Eliminando cuentas..."
        filterComponent={
          <FilterPaymentAccountAd
            accounts={accounts}
            onFilteredChange={setFilteredAccounts}
          />
        }
      />

      <Card>
        <ListPaymentAccountAd
          accounts={filteredAccounts}
          reloadData={loadAccounts}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
          clearSelectionTrigger={clearTrigger}
        />
      </Card>

      {showModal && (
        <FormCreatePaymentAccountAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAccounts();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de eliminar ${selectedIds.length} cuenta${selectedIds.length > 1 ? 's' : ''} de pago? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default PaymentAccountPage;
