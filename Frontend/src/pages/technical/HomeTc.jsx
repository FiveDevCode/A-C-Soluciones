import styled from "styled-components";
import CategoryRecomendTc from "../../components/technical/CategoryRecomendTc";
import { Divider } from "@mui/material";
import ActivityFilterTc from "../../components/technical/ActivityFilterTc";
import ActivityListTc from "../../components/technical/ActivityListTc";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";

const PageContainer = styled.div`
  margin-left: 220px;
  padding: 2rem 4rem;
  min-height: calc(100vh);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: 180px;
    padding: 1.5rem 1rem;
  }
`;

const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

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
        console.log(res.data.data)
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, [technicalId]);

  return (
    <PageContainer>
      <ContainerHome>
        <CategoryRecomendTc />
        <Divider />
        <ActivityFilterTc />
        <ActivityListTc visits={visits} />
      </ContainerHome>
    </PageContainer>
  );
};


export default HomeTc;