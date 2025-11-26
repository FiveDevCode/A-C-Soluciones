import { useState } from "react";
import styled from "styled-components";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import ListServiceAd from "../../components/administrator/ListServiceAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleDeleteServiceAd } from "../../controllers/administrator/deleteServiceAd.controller";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateServiceAd from "../../components/administrator/FormCreateServiceAd";
import FilterServicesAd from "../../components/administrator/FilterServiceAd";
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

const ServicePageAd = () => {
  const { data: services, isLoading: loading, reload: loadServices } = useDataCache(
    'services_cache',
    handleGetListServiceAd
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
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
        await handleDeleteServiceAd(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadServices();
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
        headerTitle="GESTIÓN DE SERVICIOS"
        sectionTitle="Lista de servicios asignados"
        addLabel="Agregar servicio"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterServicesAd
            services={services}
            onFilteredChange={setFilteredServices}
          />
        }
        actionType="Deshabilitar seleccionados"
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando servicios...
          </p>
        ) : filteredServices.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No hay ningún servicio asignado por el momento.
          </p>
        ) : (
          <ListServiceAd
            services={filteredServices}
            reloadData={loadServices}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateServiceAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadServices();
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

export default ServicePageAd;
