import styled from "styled-components";
import RecommendedService from "../../components/client/RecomendCategoryHomeCl";
import servicio from "../../assets/client/Servicio.png"
import ServicesByCategoryCl from "../../components/client/ServicesByCategoryCl";
import MenuSideCl from "../../components/client/MenuSideCl";
import HeaderBarCl from "../../components/client/HeaderBarCl";
import { useMenu } from "../../components/client/MenuContext";

const PageContainer = styled.div`
  margin-left: 220px;
  margin-top: 145px; /* 50px + 95px del header */
  padding: 2rem 4rem;
  min-height: calc(100vh - 145px);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: 180px;
    padding: 1.5rem 1rem;
  }
  
  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const ContentHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.125rem;
`;

const HomeSessionPageCl = () => {
  const { collapsed } = useMenu();
  return (
    <>
      <MenuSideCl />
      <HeaderBarCl />
      <PageContainer $collapsed={collapsed}>
        <ContentHome>
          <RecommendedService
            id="2"
            color="#28a745"
            image={servicio}
          />
          <ServicesByCategoryCl />
        </ContentHome>
      </PageContainer>
    </>
  );
}

export default HomeSessionPageCl;

