import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListReportAd from "../../components/administrator/ListReportAd";
import FilterReportAd from "../../components/administrator/FilterReportAd";
import useDataCache from "../../hooks/useDataCache";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { handleGetListReportAd } from "../../controllers/administrator/getListReportAd.controller";

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

const ReportPageAd = () => {
  const { data: reports, isLoading: loading, reload: loadReports } = useDataCache(
    'reports_cache',
    async () => {
      const response = await handleGetListReportAd();
      return response.data || [];
    }
  );

  const { timeAgo, manualRefresh } = useAutoRefresh(loadReports, 3, 'maintenance_sheets');
  const [filteredReports, setFilteredReports] = useState([]);

  // Inicializar filteredReports con todos los reports cuando se cargan
  useEffect(() => {
    if (reports && reports.length > 0) {
      setFilteredReports(reports);
    }
  }, [reports]);

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="FICHAS DE MANTENIMIENTO"
        sectionTitle="Fichas de mantenimiento generadas"
        onRefresh={manualRefresh}
        lastUpdateTime={timeAgo}
        filterComponent={
          <FilterReportAd
            reports={reports}
            onFilteredChange={setFilteredReports}
          />
        }
      />

      <Card>
        <ListReportAd
          reports={filteredReports}
          reloadData={loadReports}
          isLoadingData={loading}
        />
      </Card>
    </Container>
  );
};

export default ReportPageAd;