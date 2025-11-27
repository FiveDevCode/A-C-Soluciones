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

const BillPageAd = () => {
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
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un registro para eliminar.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      for (const id of selectedIds) {
        await handleDeleteBill(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadBills();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      alert("Error al eliminar algunos registros.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="GESTIÓN DE FACTURAS"
        sectionTitle="Listado de facturas"
        addLabel="Agregar factura"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={loadBills}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterBillAd bills={bills} onFilteredChange={setFilteredBills} />
        }
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando facturas...
          </p>
        ) : (
          <ListBillAd
            bills={filteredBills}
            reloadData={loadBills}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
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
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </Container>
  );
};

export default BillPageAd;
