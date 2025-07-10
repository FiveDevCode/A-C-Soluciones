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
        icon={faTasks}
        title="Asignación de visitas"
        description="Organiza fácilmente el cronograma de trabajo asignando visitas técnicas desde el panel."
        to="/admin/asignar-visita"
        color="#28a745"
        image={servicio}
      />
      <ServicesByCategoryCl />
      
    </ContentHome>
  )
}


export default HomeSessionPageCl;
