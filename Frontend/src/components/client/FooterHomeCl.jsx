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
`
const ContainerFooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
const TitleCopyright = styled.h1`
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: bold;
`

const DividerFooter = styled(Divider)`
  background-color: #FFFFFF;
`
const ContainerFooterOption = styled.div`
  display: flex;
  gap: 2rem;

`
const OptionFooter = styled(Link)`
  font-size: 1rem;
  color: #FFFFFF;
`

const FooterHomeCl = () => {
  return (
    <ContainerFooter>
      <ContainerFooterInfo>
        <Logo src={logo} size="10%" min="120px" alt="logo"/>
        <TitleCopyright>© A & C Soluciones 2025</TitleCopyright>
      </ContainerFooterInfo>
      <DividerFooter />
      <ContainerFooterOption>
        <OptionFooter to="/about-us">Acerca de nosotros</OptionFooter>
        <OptionFooter to="/privacy-policy">Politicas de privacidad</OptionFooter>
        <OptionFooter to="/faq">Preguntas Frecuentes (FAQ)</OptionFooter>
        <OptionFooter to="/terms-and-conditions">Términos y Condiciones</OptionFooter>
      </ContainerFooterOption>
    </ContainerFooter>
  )
}

export default FooterHomeCl;