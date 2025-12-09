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

const ServicePageAd = () => {
  const { data: services, isLoading: loading, reload: loadServices } = useDataCache(
    'services_cache',
    handleGetListServiceAd
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadServices, 3, 'services');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un servicio para deshabilitar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteServiceAd(id);
      }
      const cantidad = selectedIds.length;

      const texto = cantidad === 1
        ? "1 servicio deshabilitado correctamente"
        : `${cantidad} servicios deshabilitados correctamente`;

      showToast(texto, "success", 4000);
      setSelectedIds([]);
      setClearTrigger(prev => prev + 1);
      loadServices();
    } catch (error) {
      showToast("Error al deshabilitar los servicios", "error", 5000);
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
        headerTitle="SERVICIOS"
        sectionTitle="Lista de servicios asignados"
        addLabel="Agregar servicio"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Deshabilitando servicios..."
        actionType="Deshabilitar seleccionados"
        filterComponent={
          <FilterServicesAd
            services={services}
            onFilteredChange={setFilteredServices}
          />
        }
      />

      <Card>
        <ListServiceAd
          services={filteredServices}
          reloadData={loadServices}
          onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          isLoadingData={loading}
          clearSelectionTrigger={clearTrigger}
        />
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
          message={`¿Está seguro de deshabilitar ${selectedIds.length} servicio${selectedIds.length > 1 ? 's' : ''}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </Container>
  );
};

export default ServicePageAd;
