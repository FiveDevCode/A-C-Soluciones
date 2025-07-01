import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import ListRequestAd from "../../components/administrator/ListRequestAd";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewRequestListPageAd = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    handleGetListRequest()
      .then((res) => {
        console.log("respuesta:" , res)
        setRequests(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener la lista de solicitudes:", err);
      });
  }, []);

  return (
    <ContainerServices>

      <FilterServicesAd count={requests.length}  />
      {requests.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna solicitud por el momento.</p>
      ) : (
        <ListRequestAd requests={requests} />
      )}

    </ContainerServices>
  )
}



export default ViewRequestListPageAd