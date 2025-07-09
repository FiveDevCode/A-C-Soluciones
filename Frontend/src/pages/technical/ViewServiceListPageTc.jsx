import { useEffect, useState } from "react";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import ListServiceAd from "../../components/administrator/ListServiceAd";



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
        console.log("respuesta:" , res)
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
        <ListServiceAd services={services} />
      )}

    </ContainerServices>
  )
}



export default ViewServiceListPageTc