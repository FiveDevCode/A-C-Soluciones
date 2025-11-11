import { useEffect, useState } from "react";
import styled from "styled-components";
import { handleGetListAccountingAd } from "../../controllers/administrator/getListAccountingAd.controller";
import ListAccountingAd from "../../components/administrator/ListAccountingAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
//import { handleDeleteAccountingAd } from "../../controllers/administrator/deleteAccountingAd.controller";
import FilterAccountingAd from "../../components/administrator/FilterAccountingAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateAccountingAd from "../../components/administrator/FormCreateAccountingAd";

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
  const [accountings, setAccountings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredAccounting, setFilteredAccounting] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadAccounting();
  }, []);

  const loadAccounting = async () => {
    setLoading(true);
    try {
      const data = await handleGetListAccountingAd();
      setAccountings(data);
    } catch (err) {
      console.error("Error cargando lista contable:", err);
    } finally {
      setLoading(false);
    }
  };

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
        //await handleDeleteAccountingAd(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadAccounting();
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
        headerTitle="GESTIÓN CONTABLE"
        sectionTitle="Lista de empleados contables"
        addLabel="Agregar empleado contable"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterAccountingAd
            accountings={accountings}
            onFilteredChange={setFilteredAccounting}
          />
        }
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando lista contable...
          </p>
        ) : (
          <ListAccountingAd
            accountings={filteredAccounting}
            reloadData={loadAccounting}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
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
          message={`¿Está seguro de que desea eliminar ${selectedIds.length} registro(s)? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </Container>
  );
};

export default AccountingPageAd;
