import { useEffect, useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import ListRequestAd from "../../components/administrator/ListRequestAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FilterRequestsAd from "../../components/administrator/FilterRequestsAd";
import { handleDeleteRequestAd } from "../../controllers/administrator/deleteRequestAd.controller";

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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await handleGetListRequest();
      console.log(res)
      setRequests(res.data);
    } catch (err) {
      console.error("Error cargando lista de solicitudes:", err);
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
        await handleDeleteRequestAd(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadRequests();
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
        headerTitle="GESTIÓN DE SOLICITUDES"
        sectionTitle="Lista de solicitudes registradas"
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterRequestsAd
            requests={requests}
            onFilteredChange={setFilteredRequests}
          />
        }
        actionType="Eliminar seleccionados"
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando solicitudes...
          </p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No hay ninguna solicitud por el momento.
          </p>
        ) : (
          <ListRequestAd
            requests={filteredRequests}
            reloadData={loadRequests}
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

export default RequestPageAd;
