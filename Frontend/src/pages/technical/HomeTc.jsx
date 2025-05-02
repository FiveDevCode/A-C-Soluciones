import styled from "styled-components";
import CategoryRecomendTc from "../../components/technical/CategoryRecomendTc";
import { Divider } from "@mui/material";
import ActivityFilterTc from "../../components/technical/ActivityFilterTc";
import ActivityListTc from "../../components/technical/ActivityListTc";




const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`



const HomeTc = () => {
  return (
    <ContainerHome>
      <CategoryRecomendTc />
      <Divider />
      <ActivityFilterTc />
      <ActivityListTc />
    </ContainerHome>
  )
}


export default HomeTc;