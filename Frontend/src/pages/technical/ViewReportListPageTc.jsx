import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListToken } from "../../controllers/common/getListToken.controller";
import { jwtDecode } from "jwt-decode";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";
import ListReportTc from "../../components/technical/ListReportTc";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewReportListPageTc = () => {
  const [visits, setVisits] = useState([]);
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
        // Obtener las fichas (reportes)
        const reportRes = await handleGetListToken();
        const reportList = reportRes.data;

        // Obtener las visitas
        const visitRes = await handleGetVisitAssign(idTechnical);
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

      } catch (err) {
        console.error("Error al obtener visitas con reporte:", err);
      }
    };

    fetchData();
  }, [idTechnical]);


  return (
    <ContainerServices>

      <FilterServicesAd count={visits.length} />
      {visits.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna reporte generado por el momento.</p>
      ) : (
        <ListReportTc visits={visits} />
      )}

    </ContainerServices>
  )
}



export default ViewReportListPageTc