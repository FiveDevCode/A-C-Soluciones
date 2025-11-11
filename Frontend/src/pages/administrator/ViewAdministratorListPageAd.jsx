import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListAdministrator } from "../../controllers/administrator/getAdministratorListAd.controller";
import ListAdministratorAd from "../../components/administrator/ListAdministratorAd";



const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`




const ViewAdministratorListPageAd = () => {
  const [administrators, setAdministrators] = useState([]);

  useEffect(() => {
    handleGetListAdministrator()
      .then((res) => {
        setAdministrators(res.data);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);

  return (
    <ContainerServices>

      <FilterServicesAd count={administrators?.length} />
      {administrators.length === 0 ? (
        <p style={{textAlign: "center"}}>No hay ninguna visita asignada por el momento.</p>
      ) : (
        <ListAdministratorAd administrators={administrators} />
      )}

    </ContainerServices>
  )
}



export default ViewAdministratorListPageAd