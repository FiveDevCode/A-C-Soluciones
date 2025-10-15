import { useEffect, useState } from "react";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import ListTechicalAd from "../../components/administrator/ListTechnicalAd";
import FilterTechnicalsAd from "../../components/administrator/FilterTechnicalsAd";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewTechnicalListPageAd = () => {
  const [technicals, setTechnicals] = useState([]);

  useEffect(() => {
    handleGetListTechnical()
      .then((res) => {
        console.log("respuesta:" , res.data)
        setTechnicals(res.data);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  return (
    <ContainerServices>

      <FilterTechnicalsAd count={technicals.length} />
      {technicals.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
      ) : (
        <ListTechicalAd technicals={technicals} />
      )}

    </ContainerServices>
  )
}



export default ViewTechnicalListPageAd