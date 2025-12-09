import FormLogin from "../../components/common/FormLogin";
import logo from '../../assets/common/logoA&C.png';
import fondoLogin from '../../assets/common/fondoLogin.png';
import styled from "styled-components";
import { Link } from "react-router-dom";

const SectionPage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${fondoLogin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    justify-content: flex-start;
  }
`

const LogoLink = styled(Link)`
  cursor: pointer;
  text-align: center;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`

const LogoImage = styled.img`
  max-width: 300px;
  width: 80%;
  height: auto;
`

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  margin-bottom: 0.75rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`

const Subtitle = styled.h4`
  width: 26%;
  align-self: center;
  max-width: 500px;
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    width: 90%;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`

const LoginPage = () => {
  return (
    <SectionPage>
      <LogoLink to="/">
        <LogoImage src={logo} alt="Logo A&C" />
      </LogoLink>
      <Title>Iniciar sesión</Title>
      <Subtitle>Inicia sesión con tu cuenta</Subtitle>
      <FormLogin />
    </SectionPage>
  )
}

export default LoginPage;