import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import ListMaintenanceReportAd from "../../components/administrator/ListMaintenanceReportAd";
import FilterMaintenanceReportAd from "../../components/administrator/FilterMaintenanceReportAd";
import FormCreateMaintenanceReportAd from "../../components/administrator/FormCreateMaintenanceReportAd";
import { handleGetListMaintenanceReportAd } from "../../controllers/administrator/getListMaintenanceReportAd.controller";
import useDataCache from "../../hooks/useDataCache";
import useAutoRefresh from "../../hooks/useAutoRefresh";

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
  const { data: reports, isLoading: loading, reload: loadReports } = useDataCache(
    'maintenance_reports_cache',
    handleGetListMaintenanceReportAd
  );
  const { timeAgo, manualRefresh } = useAutoRefresh(loadReports, 3, 'maintenance_reports');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="REPORTES ELÉCTRICOS"
        sectionTitle="Reportes eléctricos generados"
        addLabel="Agregar reporte eléctrico"
        onAdd={() => setShowModal(true)}
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterMaintenanceReportAd
            reports={reports}
            onFilteredChange={setFilteredReports}
          />
        }
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

    </Container>
  );
};

export default MaintenanceReportPageAd;
