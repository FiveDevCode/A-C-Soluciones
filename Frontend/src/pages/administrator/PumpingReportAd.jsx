import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListPumpingReportAd from "../../components/administrator/ListPumpingReportAd";
import FilterPumpingReportAd from "../../components/administrator/FilterPumpingReportAd";
import FormCreatePumpingReportAd from "../../components/administrator/FormCreatePumpingReportAd";
import { handleGetListPumpingReportAd } from "../../controllers/administrator/getListPumpingReportAd.controller";
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

const PumpingReportPageAd = () => {
  const { data: reports, isLoading: loading, reload: loadReports } = useDataCache(
    'pumping_reports_cache',
    handleGetListPumpingReportAd
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);


  return (
    <Container>
      <BaseHeaderSection
        headerTitle="REPORTES DE BOMBEO"
        sectionTitle="Reportes de bombeo generados"
        addLabel="Agregar reporte de bombeo"
        onAdd={() => setShowModal(true)}
        onRefresh={loadReports}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterPumpingReportAd
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
          <ListPumpingReportAd
            reports={filteredReports}
            reloadData={loadReports}
          />
        )}
      </Card>

      {showModal && (
        <FormCreatePumpingReportAd
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

export default PumpingReportPageAd;
