import Logo from "../common/Logo"
import logo from "../../assets/common/logoA&C.png"
import { Divider } from "@mui/material"
import styled from "styled-components"
import { Link } from "react-router-dom"


const ContainerFooter = styled.section`
  display: flex;
  flex-direction: column;
  background-color: #213569;
  padding: 0.5rem 12rem 2rem 2rem;
  gap: 1rem;

  @media (min-width: 769px) and (max-width: 1350px) {
    padding: 0.5rem 4rem 1.5rem 4rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1rem 1.5rem 1rem;
    gap: 0.75rem;
  }
`
const ContainerFooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
`
const TitleCopyright = styled.h1`
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: bold;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

const DividerFooter = styled(Divider)`
  background-color: #FFFFFF;
`
const ContainerFooterOption = styled.div`
  display: flex;
  gap: 2rem;

  @media (min-width: 769px) and (max-width: 1350px) {
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    text-align: center;
  }

`
const OptionFooter = styled(Link)`
  font-size: 1rem;
  color: #FFFFFF;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

const FooterHome = () => {
  return (
    <ContainerFooter>
      <ContainerFooterInfo>
        <Logo src={logo} size="10%" min="120px" alt="logo"/>
        <TitleCopyright>© A & C Soluciones 2025</TitleCopyright>
      </ContainerFooterInfo>
      <DividerFooter />
      <ContainerFooterOption>
        <OptionFooter to="/acerca-de-nosotros">Acerca de nosotros</OptionFooter>
        <OptionFooter to="/politicas-de-privacidad">Politicas de privacidad</OptionFooter>
        <OptionFooter to="/preguntas-frecuentes">Preguntas Frecuentes (FAQ)</OptionFooter>
        <OptionFooter to="/terminos-y-condiciones">Términos y Condiciones</OptionFooter>
      </ContainerFooterOption>
    </ContainerFooter>
  )
}

export default FooterHome;