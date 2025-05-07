import styled from "styled-components";
import BackgroundHomeCl from "../../components/client/BackgroundHomeCl";
import ContentHomeCl from "../../components/client/ContentHomeCl";
import HeaderBarCl from "../../components/client/HeaderBarCl";
import WorkProductCl from "../../components/client/WorkProductCl";
import ServicieCatalogCl from "../../components/client/ServicieCatalogCl";
import FooterHomeCl from "../../components/client/FooterHomeCl";

const ContentHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.125rem;


`



const HomeSessionPageCl = () => {
  return (
    <ContentHome>
      <BackgroundHomeCl />
      <ContentHomeCl />
      <WorkProductCl />
      <ServicieCatalogCl />

    </ContentHome>
  )
}


export default HomeSessionPageCl;
