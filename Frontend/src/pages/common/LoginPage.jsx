import FormLogin from "../../components/common/FormLogin";
import logo from '../../assets/common/logoA&C.png';
import fondoLogin from '../../assets/common/fondoLogin.jpg';
import styled from "styled-components";
import { Link } from "react-router-dom";

const SectionPage = styled.section`
  position: relative;
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

const BackButton = styled(Link)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 2px solid #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
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
      <BackButton to="/">← Regresar al inicio</BackButton>
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