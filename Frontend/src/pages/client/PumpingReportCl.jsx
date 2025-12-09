import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListPumpingReportAd from "../../components/administrator/ListPumpingReportAd";
import FilterPumpingReportAd from "../../components/administrator/FilterPumpingReportAd";
import { handleGetListPumpingReportAd } from "../../controllers/administrator/getListPumpingReportAd.controller";
import useDataCache from "../../hooks/useDataCache";
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from "../../components/client/MenuContext";

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
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

const PumpingReportPageCl = () => {
  const { collapsed } = useMenu();
  const { data: reports, isLoading: loading, reload: loadReports } = useDataCache(
    'pumping_reports_cache_cl',
    handleGetListPumpingReportAd
  );
  const [filteredReports, setFilteredReports] = useState([]);

  return (
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <BaseHeaderSection
          headerTitle="REPORTES DE BOMBEO"
          sectionTitle="Mis reportes de bombeo"
          onRefresh={loadReports}
          filterComponent={
            <FilterPumpingReportAd
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
            <ListPumpingReportAd
              reports={filteredReports}
              reloadData={loadReports}
            />
          )}
        </Card>
      </PageContainer>
    </>
  );
};

export default PumpingReportPageCl;

