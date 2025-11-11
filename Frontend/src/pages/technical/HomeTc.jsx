import styled from "styled-components";
import CategoryRecomendTc from "../../components/technical/CategoryRecomendTc";
import { Divider } from "@mui/material";
import ActivityFilterTc from "../../components/technical/ActivityFilterTc";
import ActivityListTc from "../../components/technical/ActivityListTc";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";




const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`



const HomeTc = () => {

  const [visits, setVisits] = useState([]);
  const [technicalId, setTechnicalId] = useState("");
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setTechnicalId(decoded.id); 
    }
  }, []);


  useEffect(() => {
    handleGetVisitAssign(technicalId)
      .then((res) => {
        setVisits(res.data.data); 
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
      {visits.length === 0 ? (
          <p style={{textAlign: "center"}}>No tienes ninguna actividad asignada por el momento.</p>
      ) : (
        <ActivityListTc visits={visits}/>
      )}

    </ContainerHome>
  )
}


export default HomeTc;