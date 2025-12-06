import { useState } from "react";
import styled from "styled-components";
import { handleGetListBillAd } from "../../controllers/administrator/getListBillAd.controller";
import ListBillAd from "../../components/administrator/ListBillAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateBillAd from "../../components/administrator/FormCreateBillAd";
import { handleDeleteBill } from "../../controllers/administrator/deleteBillAd.controller";
import FilterBillAd from "../../components/administrator/FilterBillAd";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
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

const BillPage = () => {
  const { data: bills, isLoading: loading, reload: loadBills } = useDataCache(
    'bills_cache',
    async () => {
      const billsData = await handleGetListBillAd();

      // Enriquecer cada factura con información del cliente
      const enrichedBills = await Promise.all(
        billsData.map(async (bill) => {
          if (bill.id_cliente) {
            try {
              const clientRes = await handleGetClient(bill.id_cliente);
              const cliente = clientRes.data;
              return {
                ...bill,
                cliente,
                nombre_cliente: `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim(),
              };
            } catch (err) {
              console.error(`Error obteniendo cliente ${bill.id_cliente}:`, err);
              return bill;
            }
          }
          return bill;
        })
      );

      return enrichedBills;
    }
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadBills, 3);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un registro para eliminar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteBill(id);
      }
      showToast(`${selectedIds.length} factura(s) eliminada(s) correctamente`, "success", 4000);
      setSelectedIds([]);
      loadBills();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      showToast("Error al eliminar las facturas", "error", 5000);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setShowConfirmModal(false);
  };  return (
    <Container>
      <BaseHeaderSection
        headerTitle="FACTURAS"
        sectionTitle="Listado de facturas"
        addLabel="Agregar factura"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Eliminando facturas..."
        filterComponent={
          <FilterBillAd bills={bills} onFilteredChange={setFilteredBills} />
        }
      />

      <Card>
        <ListBillAd
          bills={filteredBills}
          reloadData={loadBills}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
        />
      </Card>

      {showModal && (
        <FormCreateBillAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadBills();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de que desea eliminar ${selectedIds.length} registro(s)? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default BillPage;
