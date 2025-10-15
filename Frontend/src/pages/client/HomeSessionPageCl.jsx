import styled from "styled-components";
import RecommendedService from "../../components/client/RecomendCategoryHomeCl";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import servicio from "../../assets/client/Servicio.png"
import ServicesByCategoryCl from "../../components/client/ServicesByCategoryCl";

const ContentHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.125rem;


`



const HomeSessionPageCl = () => {
  return (
    <ContentHome>
      <RecommendedService
        id="2"
        color="#28a745"
        image={servicio}
      />
      <ServicesByCategoryCl />
      
    </ContentHome>
  )
}


export default HomeSessionPageCl;
