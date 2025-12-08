import HeaderBarHome from "../../components/common/HeaderBarHome";
import ContentHome from "../../components/common/ContentHome";
import BackgroundHome from "../../components/common/BackgroundHome";
import FooterHome from "../../components/common/FooterHome";
import ServicieCatalog from "../../components/common/ServicieCatalog";
import styled from "styled-components";
import ChatBubble from "../../components/chatbot/ChatBubble";


const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.125rem;
  margin-bottom: 5rem;

  @media (min-width: 769px) and (max-width: 1350px) {
    gap: 2.5rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const Home = () => {
  return (
    <ContainerHome>
      <div>
        <HeaderBarHome />
        <BackgroundHome />
      </div>
      <ContentWrapper>
        <ServicieCatalog />
        <ContentHome />
      </ContentWrapper>
      <FooterHome />
      <ChatBubble />
    </ContainerHome>
  )
}

export default Home;
