import styled from "styled-components";
import CategoryRecomendTc from "../../components/technical/CategoryRecomendTc";
import { Divider } from "@mui/material";
import ActivityFilterTc from "../../components/technical/ActivityFilterTc";
import ActivityListTc from "../../components/technical/ActivityListTc";
import { useEffect, useState } from "react";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { jwtDecode } from "jwt-decode";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";




const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`



const HomeTc = () => {

  const [services, setServices] = useState([]);
  const [technicalId, setTechnicalId] = useState("");
  

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setTechnicalId(decoded.id); 
    }
  }, []);


  useEffect(() => {
    handleGetVisitAssign(technicalId)
      .then((res) => {
        setServices(res.data.data); 
        console.log(res.data.data)
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, [technicalId]);


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