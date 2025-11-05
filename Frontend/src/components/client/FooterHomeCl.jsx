// import Logo from "../common/Logo"
// import logo from "../../assets/common/logoA&C.png"
// import { Divider } from "@mui/material"
// import styled from "styled-components"
// import { Link } from "react-router-dom"


// const ContainerFooter = styled.section`
//   display: flex;
//   flex-direction: column;
//   background-color: #213569;
//   padding: 0.5rem 12rem 2rem 2rem;
//   gap: 1rem;
// `
// const ContainerFooterInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `
// const TitleCopyright = styled.h1`
//   color: #FFFFFF;
//   font-size: 1rem;
//   font-weight: bold;
// `

// const DividerFooter = styled(Divider)`
//   background-color: #FFFFFF;
// `
// const ContainerFooterOption = styled.div`
//   display: flex;
//   gap: 2rem;

// `
// const OptionFooter = styled(Link)`
//   font-size: 1rem;
//   color: #FFFFFF;
// `

// const FooterHomeCl = () => {
//   return (
//     <ContainerFooter>
//       <ContainerFooterInfo>
//         <Logo src={logo} size="10%" min="120px" alt="logo"/>
//         <TitleCopyright>© A & C Soluciones 2025</TitleCopyright>
//       </ContainerFooterInfo>
//       <DividerFooter />
//       <ContainerFooterOption>
//         <OptionFooter to="/acerca-de-nosotros">Acerca de nosotros</OptionFooter>
//         <OptionFooter to="/politicas-de-privacidad">Politicas de privacidad</OptionFooter>
//         <OptionFooter to="/preguntas-frecuentes">Preguntas Frecuentes (FAQ)</OptionFooter>
//         <OptionFooter to="/terminos-y-condiciones">Términos y Condiciones</OptionFooter>
//       </ContainerFooterOption>
//     </ContainerFooter>
//   )
// }

// export default FooterHomeCl;


import Logo from "../common/Logo"
import logo from "../../assets/common/logoA&C.png"
import { Divider } from "@mui/material"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useMenu } from "./MenuContext"
import { useEffect, useState } from "react"

const ContainerFooter = styled.section`
  display: flex;
  flex-direction: column;
  background-color: #213569;
  padding: 2rem 4rem;
  gap: 1rem;
  margin-left: ${(props) => (props.$isClient ? (props.$collapsed ? '80px' : '220px') : '0')};
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 3rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$isClient ? (props.$collapsed ? '60px' : '180px') : '0')};
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin-left: 0;
  }
`;

const ContainerFooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const TitleCopyright = styled.h1`
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DividerFooter = styled(Divider)`
  && {
    background-color: rgba(255, 255, 255, 0.3);
    height: 1px;
  }
`;

const ContainerFooterOption = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media screen and (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const OptionFooter = styled(Link)`
  font-size: 0.95rem;
  color: #FFFFFF;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #91cdffff;
    transform: translateX(4px);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #91cdffff;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const FooterHomeCl = () => {
  const { collapsed } = useMenu();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const isClient = userRole === "cliente";

  return (
    <ContainerFooter $isClient={isClient} $collapsed={collapsed}>
      <ContainerFooterInfo>
        <Logo src={logo} size="120px" alt="logo A&C Soluciones"/>
        <TitleCopyright>© A & C Soluciones 2025</TitleCopyright>
      </ContainerFooterInfo>
      <DividerFooter />
      <ContainerFooterOption>
        <OptionFooter to="/acerca-de-nosotros">Acerca de nosotros</OptionFooter>
        <OptionFooter to="/politicas-de-privacidad">Políticas de privacidad</OptionFooter>
        <OptionFooter to="/preguntas-frecuentes">Preguntas Frecuentes (FAQ)</OptionFooter>
        <OptionFooter to="/terminos-y-condiciones">Términos y Condiciones</OptionFooter>
      </ContainerFooterOption>
    </ContainerFooter>
  )
}

export default FooterHomeCl;