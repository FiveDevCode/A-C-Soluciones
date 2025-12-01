import styled from "styled-components";
import aboutImage from "../../assets/common/aboutUs.png";
import HeaderBarHome from "../../components/common/HeaderBarHome";
import FooterHome from "../../components/common/FooterHome";
import MenuSideCl from "../../components/client/MenuSideCl";
import { useEffect, useState } from "react";
import { useMenu } from "../../components/client/MenuContext";

const ContainerPageAll = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: "Segoe UI", sans-serif;
`;

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$isClient ? (props.$collapsed ? '80px' : '220px') : '0')};
  margin-top: ${(props) => (props.$isClient ? '20px' : '0')};
  min-height: ${(props) => (props.$isClient ? 'calc(100vh - 20px)' : 'auto')};
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$isClient ? (props.$collapsed ? '60px' : '180px') : '0')};
  }
`;

const ContainerContent = styled.main`
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #ffffff;

  @media screen and (max-width: 1280px) {
    padding: 3rem 1.5rem;
  }

  @media screen and (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const ContainerPage = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  gap: 4rem;

  @media screen and (max-width: 1280px) {
    gap: 3rem;
  }

  @media screen and (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TextContainer = styled.div`
  flex: 1 1 600px;

  @media screen and (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const Image = styled.img`
  width: 350px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  user-select: none;

  @media screen and (max-width: 1024px) {
    width: 300px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    border-radius: 8px;
    display: block;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #0c2d48;
  margin-bottom: 1rem;
  border-left: 6px solid #00aaff;
  padding-left: 0.75rem;

  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
    border-left-width: 4px;
    padding-left: 0.6rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.125rem;
  color: #333;
  line-height: 1.8;

  @media screen and (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const ValuesList = styled.ul`
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;

  li {
    margin-bottom: 0.5rem;
  }

  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
    padding-left: 1rem;
    margin-top: 0.5rem;

    li {
      margin-bottom: 0.4rem;
    }
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 2rem;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media screen and (max-width: 768px) {
    height: 250px;
    margin-top: 1rem;

    iframe {
      border-radius: 8px;
    }
  }
`;

const AboutUsPage = () => {
  const [userRole, setUserRole] = useState("");
  const { collapsed } = useMenu();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const isClient = userRole === "cliente";

  return (
    <ContainerPageAll>
      {isClient ? (
        <MenuSideCl />
      ) : (
        <HeaderBarHome />
      )}

      <PageContainer $isClient={isClient} $collapsed={collapsed}>
        <ContainerContent>
          <ContainerPage>
            {/* Misión */}
            <Section>
              <TextContainer>
                <Title>Misión</Title>
                <Paragraph>
                  En A&C SOLUCIONES HIDROELÉCTRICAS nos dedicamos a brindar soluciones integrales en montaje,
                  suministro y mantenimiento de equipos hidroeléctricos. Nuestra misión es garantizar la continuidad
                  y eficiencia de los sistemas eléctricos de nuestros clientes, a través de un equipo humano calificado,
                  herramientas modernas y un servicio basado en la excelencia, la seguridad y la responsabilidad ambiental.
                </Paragraph>
              </TextContainer>
              <Image src={aboutImage} alt="Misión" loading="lazy" />
            </Section>

            {/* Visión */}
            <Section>
              <TextContainer>
                <Title>Visión</Title>
                <Paragraph>
                  Para el año 2028, aspiramos a consolidarnos como la empresa líder en el suroccidente colombiano en el
                  sector de soluciones hidroeléctricas. Seremos reconocidos por nuestra capacidad de respuesta, innovación
                  tecnológica y compromiso con la sostenibilidad, contribuyendo al desarrollo energético de la región con
                  servicios confiables, accesibles y sostenibles.
                </Paragraph>
              </TextContainer>
            </Section>

            {/* Valores */}
            <Section>
              <TextContainer>
                <Title>Valores Institucionales</Title>
                <Paragraph>
                  En nuestra organización cultivamos principios que orientan nuestro comportamiento diario y fortalecen
                  nuestra cultura corporativa:
                </Paragraph>
                <ValuesList>
                  <li><strong>Responsabilidad:</strong> Cumplimos nuestros compromisos con calidad y ética.</li>
                  <li><strong>Cumplimiento:</strong> Respetamos los tiempos y acuerdos pactados con nuestros clientes.</li>
                  <li><strong>Vocación de servicio:</strong> Brindamos atención oportuna y personalizada.</li>
                  <li><strong>Trabajo en equipo:</strong> Valoramos el esfuerzo colectivo para lograr mejores resultados.</li>
                  <li><strong>Innovación:</strong> Buscamos mejorar continuamente nuestros procesos y soluciones.</li>
                </ValuesList>
              </TextContainer>
            </Section>

            {/* Servicios */}
            <Section>
              <TextContainer>
                <Title>Servicios</Title>
                <Paragraph>
                  A&C ofrece una amplia gama de servicios técnicos especializados, diseñados para cubrir necesidades
                  tanto residenciales como industriales. Entre ellos se destacan:
                </Paragraph>
                <ValuesList>
                  <li>Instalación y mantenimiento de equipos de presión</li>
                  <li>Montaje de plantas eléctricas de emergencia</li>
                  <li>Diseño e implementación de sistemas de riego</li>
                  <li>Construcción y soporte de redes contra incendio</li>
                  <li>Proyectos de instalaciones eléctricas en baja y media tensión</li>
                  <li>Diseño y mantenimiento de piscinas</li>
                  <li>Instalación y calibración de brazos hidráulicos</li>
                </ValuesList>
                <Paragraph>
                  Adicionalmente, contamos con atención de emergencias eléctricas y mecánicas 24/7 para garantizar la
                  tranquilidad de nuestros clientes.
                </Paragraph>
              </TextContainer>
            </Section>

            {/* Ubicación */}
            <Section>
              <TextContainer>
                <Title>Ubicación</Title>
                <Paragraph>
                  Nuestra oficina principal se encuentra en Palmira, Valle del Cauca. Contamos con cobertura de servicios
                  en ciudades cercanas y zonas rurales.
                </Paragraph>
                <MapContainer>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.78586463856675!2d-76.30018023610228!3d3.521010827796462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3a04e1875e9fc9%3A0xebd4905e02a9392a!2sCl.%2023%20%23%2028-11%2C%20Palmira%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1752158359445!5m2!1ses-419!2sco"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de A&C Soluciones Hidroeléctricas"
                  />
                </MapContainer>
              </TextContainer>
            </Section>
          </ContainerPage>
        </ContainerContent>
      </PageContainer>

      {!isClient && <FooterHome />}
    </ContainerPageAll>
  );
};

export default AboutUsPage;