import { Button } from "@mui/material";
import whoHome from "../../assets/client/whoHome.png"
import serviceHome from "../../assets/client/serviceHome.png";
import styled from "styled-components";
import { Link } from "react-router-dom";


const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0 8rem;
  gap: 3.125rem;
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
    
  }
`
const ContainerWho = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media screen and (max-width: 1520px) {
    gap: 1rem;
  }

  @media screen and (max-width: 1280px) {
    padding-top: 0;
  }

`
const ContainerWhoInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 2rem;
  gap: 2rem;
  width: 40%;

  @media screen and (max-width: 1520px) {
    gap: 1rem;
    padding-top: 0.5rem;
    width: 50%;
  }

  @media screen and (max-width: 1280px) {
    padding-top: 0;
  }


`
const Img = styled.img`
  
  @media screen and (max-width: 1520px) {
    width: 50%;
    height: fit-content; 
  }



`


const WhoTitle = styled.h1`
  font-size: 1.625rem;
  color: #5B5BDE;
  font-weight: bold;
`
const WhoDescription = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 2.5rem;
  color: #505050;
`

const ContainerService = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media screen and (max-width: 1520px) {
    gap: 1rem;
    
  }

  @media screen and (max-width: 1280px) {
    gap: 1.5rem;
    padding-top: 0;
  }


`
const ContainerServiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  gap: 2rem;
  align-items: flex-start;
  width: 40%;

  
  @media screen and (max-width: 1520px) {
    gap: 1rem;
    padding-top: 0.5rem;
    width: 50%;

  }

  @media screen and (max-width: 1280px) {
    padding-top: 0;
    width: 50%;
  }

`
const ServiceTitle = styled.h1`
  font-size: 1.625rem;
  color: #5B5BDE;
  font-weight: bold;
`
const ServiceDescription = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  line-height: 2.5rem;
  width: 100%;
  color: #505050;

`

const CustomButton = styled(Button)`

  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    font-weight: bold;
  }

`


const ContentHome = () => {
  return (
    <ContainerHome>
      <ContainerWho>
        <ContainerWhoInfo>
          <WhoTitle>QUIENES SOMOS?</WhoTitle>
          <WhoDescription>
            A & C Soluciones hidroeléctricas es una empresa 
            dedicada a la prestacion de servicios de montaje, 
            suministro y mantenimiento de equipos hidroelectricos, 
            y cuenta con un equipo humano calificado que busca 
            satisfacer las necesidades de nuestros clientes.
          </WhoDescription>
          <CustomButton variant="contained" LinkComponent={Link} to="/acerca-de-nosotros" >Seguir leyendo</CustomButton>
        </ContainerWhoInfo>

        <Img src={whoHome} alt="whoHome.png" />
          
      </ContainerWho>

      <ContainerService>
    
        <Img src={serviceHome} alt="serviceHome.png"/>


        <ContainerServiceInfo>
          <ServiceTitle>NUESTROS SERVICIOS</ServiceTitle>
          <ServiceDescription>
            En A&C Soluciones hidroeléctricas ofrecemos una 
            amplia gama de servicios de instalación, mantenimientos 
            correctivos y preventivos de equipos de presión, plantas 
            eléctricas de emergencia, sistemas de riego, redes contra 
            incendio, instalaciones eléctricas, piscinas y brazos hidráulicos con un cubrimiento 
            de emergencias 24 horas al día, los 7 días de la semana.
          </ServiceDescription>
          <CustomButton variant="contained" LinkComponent={Link} to="/acerca-de-nosotros" >Seguir leyendo</CustomButton>

        </ContainerServiceInfo>

      </ContainerService>
    </ContainerHome>
  )
}

export default ContentHome;
