import { useEffect, useState } from "react";
import styled from "styled-components";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import ListClientAd from "../../components/administrator/ListClientAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterClientAd from "../../components/administrator/FilterClientAd";
import { handleDeleteClientAd } from "../../controllers/administrator/deleteClientAd.controller";

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
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await handleGetListClient();
      setClients(data);
    } catch (err) {
      console.error("Error cargando lista de clientes:", err);
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
        await handleDeleteClientAd(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadClients();
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
        headerTitle="GESTIÓN DE CLIENTES"
        sectionTitle="Lista de clientes"
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterClientAd
            clients={clients}
            onFilteredChange={setFilteredClients}
          />
        }
        actionType="Deshabilitar seleccionados"
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando lista de clientes...
          </p>
        ) : (
          <ListClientAd
            clients={filteredClients}
            reloadData={loadClients}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

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

export default ClientPageAd;
