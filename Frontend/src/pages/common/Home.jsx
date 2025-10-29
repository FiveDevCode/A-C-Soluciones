import HeaderBarHome from "../../components/common/HeaderBarHome";
import ContentHome from "../../components/common/ContentHome";
import BackgroundHome from "../../components/common/BackgroundHome";
import FooterHome from "../../components/common/FooterHome";
import ServicieCatalog from "../../components/common/ServicieCatalog";
import styled from "styled-components";
import WorkProductCl from "../../components/client/WorkProductCl";
import ChatBubble from "../../components/chatbot/ChatBubble";


const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.125rem;

`;

const Home = () => {
  return (
    <ContainerHome>
      <div>
        <HeaderBarHome />
        <BackgroundHome />
      </div>
      <ContentHome />
      <WorkProductCl />
      <ServicieCatalog />
      <FooterHome />
      <ChatBubble />
    </ContainerHome>
  )
}

export default Home;
