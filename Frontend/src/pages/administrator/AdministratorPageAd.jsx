import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListAdministratorAd from "../../components/administrator/ListAdministratorAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreateAdministratorAd from "../../components/administrator/FormCreateAdministratorAd";
import { handleGetListAdministrator } from "../../controllers/administrator/getAdministratorListAd.controller";
import { handleDeleteAdministratorAd } from "../../controllers/administrator/deleteAdministratorAd.controller";
import FilterAdministratorAd from "../../components/administrator/FilterAdministratorAd";
import useDataCache from "../../hooks/useDataCache";
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

const AdministratorPageAd = () => {
  const { data: administrators, isLoading: loading, reload: loadAdministrators } = useDataCache(
    'administrators_cache',
    async () => {
      const res = await handleGetListAdministrator();
      return res.data;
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredAdministrators, setFilteredAdministrators] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToastContext();

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un administrador para eliminar.", "error", 3000);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    try {
      for (const id of selectedIds) {
        await handleDeleteAdministratorAd(id);
      }
      showToast(`${selectedIds.length} administrador(es) eliminado(s) correctamente`, "success", 4000);
      setSelectedIds([]);
      loadAdministrators();
    } catch (error) {
      console.error("Error eliminando administradores:", error);
      showToast("Error al eliminar los administradores", "error", 5000);
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
        headerTitle="ADMINISTRADORES"
        sectionTitle="Listado de administradores del sistema"
        addLabel="Agregar administrador"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={loadAdministrators}
        selectedCount={selectedIds.length}
        isLoading={isDeleting}
        loadingMessage="Eliminando administradores..."
        actionType="Eliminar seleccionados"
        filterComponent={
          <FilterAdministratorAd
            administrators={administrators}
            onFilteredChange={setFilteredAdministrators}
          />
        }
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando administradores...
          </p>
        ) : (
          <ListAdministratorAd
            administrators={filteredAdministrators}
            reloadData={loadAdministrators}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateAdministratorAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAdministrators();
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

export default AdministratorPageAd;
