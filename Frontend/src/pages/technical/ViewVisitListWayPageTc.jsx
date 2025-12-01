import styled from "styled-components";
import { useEffect, useState } from "react";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";
import FilterVisitsAd from "../../components/administrator/FilterVisitsAd";
import { jwtDecode } from "jwt-decode";
import ListVisitTc from "../../components/technical/ListVisitTc";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { useMenu } from "../../components/technical/MenuContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  transition: margin-left 0.3s ease;

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
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const ContainerService = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewViewVisitListWayPageTc = () => {
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
    if (idTechnical) {
      handleGetVisitAssign(idTechnical)
        .then((res) => {
          const datosVisitas = Array.isArray(res.data.data) ? res.data.data : [];
          const visitasEnCamino = datosVisitas.filter(visita => visita.estado === "en_camino");

          setVisits(visitasEnCamino);
          setFilteredVisits(visitasEnCamino);
        })
        .catch((err) => {
          console.error("Error fetching service list:", err);
        });
    }
  }, [idTechnical]);

  const handleRefresh = () => {
    if (idTechnical) {
      handleGetVisitAssign(idTechnical)
        .then((res) => {
          const datosVisitas = Array.isArray(res.data.data) ? res.data.data : [];
          const visitasEnCamino = datosVisitas.filter(visita => visita.estado === "en_camino");

          setVisits(visitasEnCamino);
          setFilteredVisits(visitasEnCamino);
        })
        .catch((err) => {
          console.error("Error fetching service list:", err);
        });
    }
  };

  return (
    <Container $collapsed={collapsed}>
      <BaseHeaderSection
        headerTitle="VISITAS EN CAMINO"
        sectionTitle="Listado de visitas en camino"
        onRefresh={handleRefresh}
        filterComponent={
          <FilterVisitsAd 
            visits={visits}
            onFilteredChange={setFilteredVisits}
          />
        }
      />

      <Card>
        <ContainerService>
          {filteredVisits.length === 0 ? (
            <p style={{textAlign: "center", marginTop: "20px"}}>No tienes ninguna visita en estado "En camino" por el momento.</p>
          ) : (
            <ListVisitTc visits={filteredVisits} />
          )}
        </ContainerService>
      </Card>
    </Container>
  )
}

export default ViewViewVisitListWayPageTc;