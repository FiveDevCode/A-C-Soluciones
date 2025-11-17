import { useEffect, useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import ListMaintenanceReportAd from "../../components/administrator/ListMaintenanceReportAd";
import FilterMaintenanceReportAd from "../../components/administrator/FilterMaintenanceReportAd";
import FormCreateMaintenanceReportAd from "../../components/administrator/FormCreateMaintenanceReportAd";
import { handleGetListMaintenanceReportAd } from "../../controllers/administrator/getListMaintenanceReportAd.controller";

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

const MaintenanceReportPageAd = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await handleGetListMaintenanceReportAd();
      setReports(data);
    } catch (err) {
      console.error("Error cargando reportes de mantenimiento:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="GESTIÓN DE REPORTES DE MANTENIMIENTO"
        sectionTitle="Reportes generados"
        addLabel="Agregar reporte"
        onAdd={() => setShowModal(true)}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterMaintenanceReportAd
            reports={reports}
            onFilteredChange={setFilteredReports}
          />
        }
        actionType="Deshabilitar seleccionados"
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando reportes...
          </p>
        ) : (
          <ListMaintenanceReportAd
            reports={filteredReports}
            reloadData={loadReports}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateMaintenanceReportAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadReports();
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

export default MaintenanceReportPageAd;
