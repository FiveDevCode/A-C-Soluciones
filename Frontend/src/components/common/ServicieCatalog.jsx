import { Link } from "react-router-dom";
import styled from "styled-components";


const ContainerCatalog = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 8rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  
  @media screen and (max-width: 1520px) {
    padding: 2.5rem 4rem;
  }
  @media screen and (max-width: 1350px) {
    padding: 2rem 2rem;
  }
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const TitleService = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #5B5BDE 0%, #7B7BFF 100%);
    margin: 0.75rem auto 0;
    border-radius: 2px;
  }

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 600px;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const ContainerService = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CatalogService = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(91, 91, 222, 0.15);
    border-color: #5B5BDE;
  }

  @media (min-width: 769px) and (max-width: 1350px) {
    padding: 1.5rem;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 0.75rem;
  }
`;

const TitleCatalog = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #5B5BDE;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.75rem;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const Service = styled(Link)`
  font-size: 0.95rem;
  font-weight: 400;
  color: #4a4a4a;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  padding-left: 1.5rem;
  line-height: 1.5;

  &::before {
    content: '→';
    position: absolute;
    left: 0.5rem;
    color: #5B5BDE;
    font-weight: bold;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #f8f9fa;
    color: #5B5BDE;
    padding-left: 2rem;
    
    &::before {
      transform: translateX(4px);
    }
  }

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 0.85rem;
    padding: 0.4rem 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.5rem;
    padding-left: 1.5rem;
  }
`;



const ServicieCatalog = () => {
  const serviceMessage = { message: "Para acceder a nuestros servicios debes iniciar sesión o crear una cuenta" };
  
  return (
    <ContainerCatalog>
      <TitleService>Nuestros Servicios</TitleService>
      <Subtitle>Soluciones profesionales para todas tus necesidades</Subtitle>
      <ContainerService>
        <CatalogService>
          <TitleCatalog>MONTAJE Y MANTENIMIENTO DE EQUIPOS DE PRESIÓN</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Bombas centrífugas</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Bombas sumergibles tipo lapicero</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Bombas nivel freático</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Bombas para piscina</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Bombas de red contra incendios</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Controladores de velocidad variable</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Aguas residuales (PTAR)</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>MANTENIMIENTO PLANTA ELÉCTRICA DE EMERGENCIA</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Motor</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Sistema eléctrico</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Prueba de motor</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Instalación y mantenimiento red contra incendios</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Suministro, instalación y mantenimiento a brazos hidráulicos</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>SERVICIOS ELÉCTRICOS Y ESPECIALIZADOS</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Diseño y montaje de instalaciones eléctricas</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Diseño y montaje de sistemas de iluminación comercial</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Instalación de transferencias manuales y automáticas</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Diseño y montaje de tableros de control</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Automatizaciones y programación de PLC</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Fragua de piscinas</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Impermeabilización de tanques de almacenamiento</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Impermeabilización de terrazas</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>TABLEROS DE CONTROL</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Ensamble y mantenimiento preventivo a tableros de control</Service>
          <TitleCatalog>EXCAVACIÓN DE POZOS PROFUNDOS</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Pozos de agua nivel freático</Service>
          <TitleCatalog>LAVADO Y DESINFECCIÓN DE TANQUES</TitleCatalog>
          <Service to="/iniciar-sesion" state={serviceMessage}>Chequeo general de condiciones físicas del tanque</Service>
          <Service to="/iniciar-sesion" state={serviceMessage}>Inspección de empaques, válvulas y tuberías</Service>
        </CatalogService>
      </ContainerService>


    </ContainerCatalog>

  )
}


export default ServicieCatalog;
