import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterVisitsAd from "../../components/administrator/FilterVisitsAd";
import { jwtDecode } from "jwt-decode";
import { handleGetAllVisitsAssign } from "../../controllers/technical/getVisitAssignTc.controller";
import ListReportTc from "../../components/technical/ListReportTc";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { useMenu } from "../../components/technical/MenuContext";
import { technicalService } from "../../services/techical-service";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: margin-left 0.3s ease;

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

const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewReportListPageTc = () => {
  const { collapsed } = useMenu();
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [idTechnical, setIdTechnical] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIdTechnical(decoded.id); 
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener las fichas (reportes) del técnico
        const reportRes = await technicalService.getFichasPorTecnico(idTechnical);
        const reportList = reportRes.data.fichas || [];

        // Obtener las visitas (usa el token, no necesita ID)
        const visitRes = await handleGetAllVisitsAssign();
        const allVisits = visitRes.data.data;

        // Crear un mapa: { id_visitas => pdf_path }
        const reportMap = {};
        for (const ficha of reportList) {
          reportMap[ficha.id_visitas] = ficha.pdf_path;
        }

        // Filtrar e inyectar pdf_path a las visitas que tengan reporte
        const filteredVisits = allVisits
          .filter(visit => reportMap[visit.id])
          .map(visit => ({
            ...visit,
            pdf_path: reportMap[visit.id]
          }));

        setVisits(filteredVisits);
        setFilteredVisits(filteredVisits);

      } catch (err) {
        console.error("Error al obtener visitas con reporte:", err);
      }
    };

    if (idTechnical) {
      fetchData();
    }
  }, [idTechnical]);

  const handleRefresh = () => {
    const fetchData = async () => {
      try {
        // Obtener las fichas (reportes) del técnico
        const reportRes = await technicalService.getFichasPorTecnico(idTechnical);
        const reportList = reportRes.data.fichas || [];

        // Obtener las visitas (usa el token, no necesita ID)
        const visitRes = await handleGetAllVisitsAssign();
        const allVisits = visitRes.data.data;

        // Crear un mapa: { id_visitas => pdf_path }
        const reportMap = {};
        for (const ficha of reportList) {
          reportMap[ficha.id_visitas] = ficha.pdf_path;
        }

        // Filtrar e inyectar pdf_path a las visitas que tengan reporte
        const filteredVisits = allVisits
          .filter(visit => reportMap[visit.id])
          .map(visit => ({
            ...visit,
            pdf_path: reportMap[visit.id]
          }));

        setVisits(filteredVisits);
        setFilteredVisits(filteredVisits);

      } catch (err) {
        console.error("Error al obtener visitas con reporte:", err);
      }
    };

    if (idTechnical) {
      fetchData();
    }
  };

  return (
    <Container $collapsed={collapsed}>
      <BaseHeaderSection
        headerTitle="REPORTES"
        sectionTitle="Listado de reportes generados"
        onRefresh={handleRefresh}
        filterComponent={
          <FilterVisitsAd 
            visits={visits}
            onFilteredChange={setFilteredVisits}
          />
        }
      />

      <Card>
        <ContainerServices>
          {filteredVisits.length === 0 ? (
            <p style={{textAlign: "center", marginTop: "20px"}}>No hay ninguna reporte generado por el momento.</p>
          ) : (
            <ListReportTc visits={filteredVisits} />
          )}
        </ContainerServices>
      </Card>
    </Container>
  );
};



export default ViewReportListPageTc