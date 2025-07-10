import { Link } from "react-router-dom";
import styled from "styled-components";


const ContainerCatalog = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8rem;
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
    
  }
`;

const TitleService = styled.h1`
  font-size: 1.75rem;
  color: #5B5BDE;
  margin-bottom: 1rem;
`;

const ContainerService = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const CatalogService = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  gap: 1.375rem;
  padding-top: 1rem;
  padding-right: 2rem;
  padding-left: 1.5rem;
  border-right: 2px solid rgba(0,0,0,0.1);
  padding-bottom: 5rem;

  &:last-child {
    border-right: none;
  }

`;

const TitleCatalog = styled.h2`
  font-size: 1rem;
  font-weight: bold;

`;

const Service = styled(Link)`
  font-size: 1rem;
  font-weight: normal;
  color: #505050;
`;



const ServicieCatalogCl = () => {
  return (
    <ContainerCatalog>
      <TitleService>SERVICIOS</TitleService>
      <ContainerService>
        <CatalogService>
          <TitleCatalog>MONTAJE Y MANTENIMIENTO DE EQUIPOS DE PRESION:</TitleCatalog>
          <Service>Bombas centrifugas</Service>
          <Service>Bombas sumergibles tipo lapicero</Service>
          <Service>Bombas nivel freático</Service>
          <Service>Bombas para piscina</Service>
          <Service>Bombas de red contra incendios</Service>
          <Service>Controladores de velocidad variable</Service>
          <Service>Aguas residuales (ptar)</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>MANTENIMIENTO PLANTA ELECTRICA DE EMERGENCIA:</TitleCatalog>
          <Service>Motor</Service>
          <Service>Sistema eléctrico</Service>
          <Service>Prueba de motor</Service>
          <Service>Instalación y Mantenimiento red contra incendios</Service>
          <Service>Suministro, instalación y mantenimiento a brazos hidráulicos</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>OTROS:</TitleCatalog>
          <Service>Diseño y montaje de instalaciones eléctricas</Service>
          <Service>Diseño y montaje de sistemas de iluminación comercial</Service>
          <Service>Instalación de transferencias manuales y automáticas</Service>
          <Service>Diseño y montaje de tableros de control con arrancadores directos, indirectos y variadores de velocidad</Service>
          <Service>Automatizaciones y programación de PLC</Service>
          <Service>Fragua de piscinas</Service>
          <Service>Impermeabilización de tanques de almacenamiento</Service>
          <Service>Impermeabilización de terrazas</Service>
        </CatalogService>
        <CatalogService>
          <TitleCatalog>TABLEROS DE CONTROL:</TitleCatalog>
          <Service>Ensamble y mantenimiento preventivo a tableros de control</Service>
          <TitleCatalog>EXCAVACION DE POZOS PROFUNDOS:</TitleCatalog>
          <Service>Pozos de agua nivel fréatico</Service>
          <TitleCatalog>LAVADO Y DESINFECCION DE TANQUES DE ALMACENAMIENTO DE AGUA POTABLE: </TitleCatalog>
          <Service>Realizamos chequeo general de las condiciones físicas del tanque, empaques, válvulas y tuberías</Service>
        </CatalogService>
      </ContainerService>


    </ContainerCatalog>

  )
}


export default ServicieCatalogCl;
