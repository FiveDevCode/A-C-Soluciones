import { useEffect, useState } from "react";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import ListClientAd from "../../components/administrator/ListClientAd";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewClientListPageAd = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    handleGetListClient()
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  return (
    <ContainerServices>

      <FilterServicesAd count={clients?.length} />
      {clients.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
      ) : (
        <ListClientAd clients={clients} />
      )}

    </ContainerServices>
  )
}



export default ViewClientListPageAd