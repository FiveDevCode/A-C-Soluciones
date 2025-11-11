import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import ListServiceTc from "../../components/technical/ListSevicesTc";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




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
    <ContainerServices>

      <FilterServicesAd count={services.length} />
      {services.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
      ) : (
        <ListServiceTc services={services} />
      )}

    </ContainerServices>
  )
}



export default ViewServiceListPageTc