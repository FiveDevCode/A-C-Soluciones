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
  margin-bottom: 2rem;
  text-align: center;
`;

const ContainerService = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 100%;
  margin-bottom: 2rem;
  
  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CatalogService = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TitleCatalog = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const Service = styled(Link)`
  font-size: 0.95rem;
  font-weight: 400;
  color: #505050;
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: color 0.2s ease, padding-left 0.2s ease;

  &:hover {
    color: #5B5BDE;
    padding-left: 0.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ServicieCatalogCl = () => {
  return (
    <ContainerCatalog>
      <TitleService>SERVICIOS POR CATEGORÍA</TitleService>
      <ContainerService>
        {/* Categoría 1: Equipos de Presión */}
        <CatalogService>
          <TitleCatalog>Montaje y Mantenimiento de Equipos de Presión</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Bombas centrifugas</Service>
            <Service to="/cliente/servicios">Bombas sumergibles tipo lapicero</Service>
            <Service to="/cliente/servicios">Bombas nivel freático</Service>
            <Service to="/cliente/servicios">Bombas para piscina</Service>
            <Service to="/cliente/servicios">Bombas de red contra incendios</Service>
            <Service to="/cliente/servicios">Controladores de velocidad variable</Service>
            <Service to="/cliente/servicios">Aguas residuales (PTAR)</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 2: Planta Eléctrica */}
        <CatalogService>
          <TitleCatalog>Mantenimiento Planta Eléctrica de Emergencia</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Motor</Service>
            <Service to="/cliente/servicios">Sistema eléctrico</Service>
            <Service to="/cliente/servicios">Prueba de motor</Service>
            <Service to="/cliente/servicios">Instalación y Mantenimiento red contra incendios</Service>
            <Service to="/cliente/servicios">Suministro, instalación y mantenimiento a brazos hidráulicos</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 3: Tableros de Control */}
        <CatalogService>
          <TitleCatalog>Tableros de Control</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Ensamble y mantenimiento preventivo a tableros de control</Service>
            <Service to="/cliente/servicios">Diseño y montaje de tableros de control con arrancadores directos, indirectos y variadores de velocidad</Service>
            <Service to="/cliente/servicios">Automatizaciones y programación de PLC</Service>
            <Service to="/cliente/servicios">Instalación de transferencias manuales y automáticas</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 4: Instalaciones Eléctricas e Iluminación */}
        <CatalogService>
          <TitleCatalog>Instalaciones Eléctricas e Iluminación</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Diseño y montaje de instalaciones eléctricas</Service>
            <Service to="/cliente/servicios">Diseño y montaje de sistemas de iluminación comercial</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 5: Excavación de Pozos */}
        <CatalogService>
          <TitleCatalog>Excavación de Pozos Profundos</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Pozos de agua nivel freático</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 6: Piscinas e Impermeabilización */}
        <CatalogService>
          <TitleCatalog>Piscinas e Impermeabilización</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Fragua de piscinas</Service>
            <Service to="/cliente/servicios">Impermeabilización de tanques de almacenamiento</Service>
            <Service to="/cliente/servicios">Impermeabilización de terrazas</Service>
          </ServiceList>
        </CatalogService>

        {/* Categoría 7: Limpieza y Desinfección */}
        <CatalogService>
          <TitleCatalog>Lavado y Desinfección de Tanques</TitleCatalog>
          <ServiceList>
            <Service to="/cliente/servicios">Realizamos chequeo general de las condiciones físicas del tanque, empaques, válvulas y tuberías</Service>
          </ServiceList>
        </CatalogService>
      </ContainerService>
    </ContainerCatalog>
  );
};

export default ServicieCatalogCl;
