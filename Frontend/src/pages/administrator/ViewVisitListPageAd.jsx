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
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    handleGetListVisitAd()
      .then((res) => {
        console.log("respuesta:" , res)
        setVisits(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  return (
    <ContainerServices>

      <FilterServicesAd count={visits.length} />
      {visits.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
      ) : (
        <ListVisitAd visits={visits} />
      )}

    </ContainerServices>
  )
}



export default ViewVisitListPageAd