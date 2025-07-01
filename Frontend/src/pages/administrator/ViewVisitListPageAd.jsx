import { useEffect, useState } from "react";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewVisitListPageAd = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    handleGetListVisitAd()
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
        <ListVisitAd services={services} />
      )}

    </ContainerServices>
  )
}



export default ViewVisitListPageAd