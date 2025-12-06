import { useState } from "react";
import styled from "styled-components";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import ListTechicalAd from "../../components/administrator/ListTechnicalAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FilterTechnicalsAd from "../../components/administrator/FilterTechnicalsAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateTechnicalAd from "../../components/administrator/FormCreateTechnicalAd";
import { handleDeleteTechnicalAd } from "../../controllers/administrator/deleteTechnicalAd.controller";
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
  box-shadow: 0 2px 0 rgba(0,0,0,0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const TechnicalPageAd = () => {
  const { data: technicals, isLoading: loading, reload: loadTechnicals } = useDataCache(
    'technicals_cache',
    async () => {
      const data = await handleGetListTechnical();
      return data?.data || [];
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredTechnicals, setFilteredTechnicals] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un técnico para eliminar.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      for (const id of selectedIds) {
        await handleDeleteTechnicalAd(id);
      }
      alert("Técnicos eliminados correctamente.");
      setSelectedIds([]);
      loadTechnicals();
    } catch (error) {
      console.error("Error eliminando técnicos:", error);
      alert("Error al eliminar algunos registros.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="TÉCNICOS"
        sectionTitle="Listado de técnicos registrados"
        addLabel="Agregar técnico"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={loadTechnicals}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterTechnicalsAd
            technicals={technicals}
            onFilteredChange={setFilteredTechnicals}
          />
        }
        actionType="Eliminar seleccionados"
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando lista de técnicos...
          </p>
        ) : (
          <ListTechicalAd
            technicals={filteredTechnicals}
            reloadData={loadTechnicals}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateTechnicalAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadTechnicals();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de que desea eliminar ${selectedIds.length} técnico(s)? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </Container>
  );
};

export default TechnicalPageAd;
