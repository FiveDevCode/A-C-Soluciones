import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServiceAd from "../../components/administrator/FilterServiceAd";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import ListServiceTc from "../../components/technical/ListSevicesTc";
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
  padding: 0 5px;
  padding-bottom: 10px;
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
  gap: 1rem;
 
`;

const ViewServiceListPageTc = () => {
  const { collapsed } = useMenu();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    handleGetListServiceAd()
      .then((res) => {
        setServices(res);
        setFilteredServices(res);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  const handleRefresh = () => {
    handleGetListServiceAd()
      .then((res) => {
        setServices(res);
        setFilteredServices(res);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  };

  return (
    <Container $collapsed={collapsed}>
      <BaseHeaderSection
        headerTitle="SERVICIOS"
        sectionTitle="Listado de servicios disponibles"
        onRefresh={handleRefresh}
        filterComponent={
          <FilterServiceAd 
            services={services}
            onFilteredChange={setFilteredServices}
          />
        }
      />

      <Card>
        <ContainerServices>
          {filteredServices.length === 0 ? (
            <p style={{textAlign: "center", marginTop: "20px"}}>No hay ninguna visita asignada por el momento.</p>
          ) : (
            <ListServiceTc services={filteredServices} />
          )}
        </ContainerServices>
      </Card>
    </Container>
  );
};



export default ViewServiceListPageTc