import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import ListServiceTc from "../../components/technical/ListSevicesTc";

const PageContainer = styled.div`
  margin-left: 220px;
  padding: 2rem 4rem;
  min-height: calc(100vh);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: 180px;
    padding: 1.5rem 1rem;
  }
`;

const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewServiceListPageTc = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    handleGetListServiceAd()
      .then((res) => {
        setServices(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  return (
    <PageContainer>
      <ContainerServices>
        <FilterServicesAd count={services.length} />
        {services.length === 0 ? (
          <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
        ) : (
          <ListServiceTc services={services} />
        )}
      </ContainerServices>
    </PageContainer>
  );
};



export default ViewServiceListPageTc