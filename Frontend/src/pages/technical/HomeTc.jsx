import styled from "styled-components";
import CategoryRecomendTc from "../../components/technical/CategoryRecomendTc";
import { Divider } from "@mui/material";
import ActivityFilterTc from "../../components/technical/ActivityFilterTc";
import ActivityListTc from "../../components/technical/ActivityListTc";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";




const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`



const HomeTc = () => {

  const [services, setServices] = useState([]);

  
  useEffect(() => {
    handleGetServiceList()
      .then((res) => {
        setServices(res.data.data); // Ajusta según la estructura real del backend
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);


  return (
    <ContainerHome>
      <CategoryRecomendTc />
      <Divider />
      <ActivityFilterTc />
      {services.length === 0 ? (
          <p style={{textAlign: "center"}}>No tienes ninguna actividad asignada por el momento.</p>
      ) : (
        <ActivityListTc services={services}/>
      )}

    </ContainerHome>
  )
}


export default HomeTc;