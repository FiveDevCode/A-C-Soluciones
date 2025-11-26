import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import ListReportAd from "../../components/administrator/ListReportAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListToken } from "../../controllers/common/getListToken.controller";
import FilterReportAd from "../../components/administrator/FilterReportAd";
import FormCreateReportAd from "../../components/administrator/FormCreateReportAd";
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

const ReportPageAd = () => {
  const { data: visits, isLoading: loading, reload: loadReports } = useDataCache(
    'reports_cache',
    async () => {
      // Obtener los reportes (fichas con pdf)
      const reportRes = await handleGetListToken();
      const reportList = reportRes.data;

      // Obtener todas las visitas
      const visitRes = await handleGetListVisitAd();
      const allVisits = visitRes.data.data;

      // Mapa para emparejar visita => pdf
      const reportMap = {};
      for (const ficha of reportList) {
        reportMap[ficha.id_visitas] = ficha.pdf_path;
      }

      // Filtrar visitas que tienen reporte y agregar pdf_path
      const visitsWithReport = allVisits
        .filter(visit => reportMap[visit.id])
        .map(visit => ({
          ...visit,
          pdf_path: reportMap[visit.id]
        }));

      return visitsWithReport;
    }
  );
  const [filteredVisits, setFilteredVisits] = useState([]);

  return (
    <Container>

      <BaseHeaderSection
        headerTitle="GESTIÓN DE REPORTES"
        sectionTitle="Reportes generados"
        addLabel="Agregar reporte"
        filterComponent={
          <FilterReportAd
            visits={visits}
            onFilteredChange={setFilteredVisits}
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
          <ListReportAd
            visits={filteredVisits}
            reloadData={loadReports}
          />
        )}
      </Card>
    </Container>
  );
};

export default ReportPageAd;
