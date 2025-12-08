import styled from "styled-components";
import HeaderBarHome from "../../components/common/HeaderBarHome";
import FooterHome from "../../components/common/FooterHome";
import { useEffect, useState } from "react";

const ContainerPageAll = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: "Segoe UI", sans-serif;
`;

const ContainerContent = styled.main`
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
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
  flex-direction: column;
  gap: 2rem;

  @media screen and (max-width: 768px) {
    gap: 1rem;
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

const PrivacyPolicyPage = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <ContainerPageAll>
      {userRole !== "cliente" && <HeaderBarHome />}

      <ContainerContent>
        <ContainerPage>
          <Section>
            <Title>Política de Privacidad</Title>
            <Paragraph>
              En A&C Soluciones Hidroeléctricas nos comprometemos a proteger la información personal de nuestros usuarios.
              Esta política describe cómo recopilamos, utilizamos y protegemos sus datos personales en conformidad con la
              Ley 1581 de 2012 y demás normas que regulan la protección de datos en Colombia.
            </Paragraph>
          </Section>

          <Section>
            <Title>1. Información Recopilada</Title>
            <Paragraph>
              Recopilamos información personal como nombres, cédulas, teléfonos, direcciones, correos electrónicos y datos
              técnicos relacionados con los servicios que prestamos. Esta información es proporcionada por el usuario al
              registrarse o utilizar nuestra plataforma.
            </Paragraph>
          </Section>

          <Section>
            <Title>2. Finalidad del Tratamiento</Title>
            <Paragraph>
              Utilizamos los datos personales para gestionar la prestación de nuestros servicios, programar visitas,
              enviar notificaciones, emitir facturas, realizar encuestas de satisfacción y mejorar la experiencia del usuario.
            </Paragraph>
          </Section>

          <Section>
            <Title>3. Almacenamiento y Seguridad</Title>
            <Paragraph>
              Los datos recopilados son almacenados en bases seguras y protegidas contra accesos no autorizados. Aplicamos
              medidas técnicas y administrativas para salvaguardar la confidencialidad, integridad y disponibilidad de la
              información.
            </Paragraph>
          </Section>

          <Section>
            <Title>4. Compartir Información</Title>
            <Paragraph>
              A&C no vende ni alquila la información personal. Solo compartimos datos con terceros cuando es necesario
              para prestar un servicio (por ejemplo, técnicos o proveedores logísticos), siempre bajo acuerdos de
              confidencialidad y uso responsable.
            </Paragraph>
          </Section>

          <Section>
            <Title>5. Derechos del Titular</Title>
            <Paragraph>
              El titular de los datos puede conocer, actualizar, rectificar o eliminar su información en cualquier momento.
              Para ejercer estos derechos, puede comunicarse a través de nuestro correo electrónico o líneas de atención.
            </Paragraph>
          </Section>

          <Section>
            <Title>6. Uso de Cookies</Title>
            <Paragraph>
              Nuestro sitio puede utilizar cookies para mejorar la navegación del usuario. Estas no recopilan información
              personal identificable. El usuario puede desactivar las cookies desde su navegador si así lo desea.
            </Paragraph>
          </Section>

          <Section>
            <Title>7. Modificaciones</Title>
            <Paragraph>
              Esta política puede actualizarse periódicamente. En caso de cambios significativos, notificaremos a través
              de nuestros canales oficiales. La continuidad en el uso de la plataforma implica la aceptación de dichas
              modificaciones.
            </Paragraph>
          </Section>

          <Section>
            <Title>8. Contacto</Title>
            <Paragraph>
              Si tiene preguntas o solicitudes relacionadas con esta política, puede escribirnos a:
              <br />
              <strong>Email:</strong> contacto@acsoluciones.com
              <br />
              <strong>Dirección:</strong> Calle 23 # 28-11, Palmira, Valle del Cauca
            </Paragraph>
          </Section>
        </ContainerPage>
      </ContainerContent>

      {userRole !== "cliente" && <FooterHome />}
    </ContainerPageAll>
  );
};

export default PrivacyPolicyPage;
