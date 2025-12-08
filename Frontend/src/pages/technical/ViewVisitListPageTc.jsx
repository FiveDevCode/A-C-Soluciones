import styled from "styled-components";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";
import FilterVisitsTc from "../../components/technical/FilterVisitsTc";
import ListVisitTc from "../../components/technical/ListVisitTc";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { useMenu } from "../../components/technical/MenuContext";

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

const ContainerService = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewVisitListPageTc = () => {
  const { collapsed } = useMenu();
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);

  useEffect(() => {
    handleGetServiceList()
      .then((res) => {
        const visitsData = Array.isArray(res.data.data) ? res.data.data : [];
        setVisits(visitsData);
        setFilteredVisits(visitsData);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  const handleRefresh = () => {
    handleGetServiceList()
      .then((res) => {
        const visitsData = Array.isArray(res.data.data) ? res.data.data : [];
        setVisits(visitsData);
        setFilteredVisits(visitsData);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  };

  return (
    <Container $collapsed={collapsed}>
      <BaseHeaderSection
        headerTitle="VISITAS"
        sectionTitle="Listado de visitas asignadas"
        onRefresh={handleRefresh}
        filterComponent={
          <FilterVisitsTc 
            visits={visits}
            onFilteredChange={setFilteredVisits}
          />
        }
      />

      <Card>
        <ContainerService>
          {filteredVisits.length === 0 ? (
            <p style={{textAlign: "center", marginTop: "20px"}}>No tienes ninguna visita asignada por el momento.</p>
          ) : (
            <ListVisitTc visits={filteredVisits} />
          )}
        </ContainerService>
      </Card>
    </Container>
  );
};

export default ViewVisitListPageTc;