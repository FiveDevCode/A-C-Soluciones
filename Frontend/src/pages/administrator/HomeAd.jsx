import { Divider } from "@mui/material";
import CategoryRecomendAd from "../../components/administrator/CategoryRecomendAd";
import styled from "styled-components";
import ActivityFilterAd from "../../components/administrator/ActivityFilterAd";
import ActivityListAd from "../../components/administrator/ActivityListAd";



const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
const HomeAd = () => {
  return (
    <ContainerHome>
      <CategoryRecomendAd />
      <Divider />
      <ActivityFilterAd />
      <ActivityListAd />

    </ContainerHome>
  )
}


export default HomeAd;