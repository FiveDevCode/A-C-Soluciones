// TermsAndConditionsPage.jsx

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
`;

const ContainerPage = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  gap: 4rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #0c2d48;
  margin-bottom: 1rem;
  border-left: 6px solid #00aaff;
  padding-left: 0.75rem;
`;

const Paragraph = styled.p`
  font-size: 1.125rem;
  color: #333;
  line-height: 1.8;
`;

const TermsAndConditionsPage = () => {
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
            <Title>Términos y Condiciones</Title>
            <Paragraph>
              Al acceder y utilizar los servicios de A&C Soluciones Hidroeléctricas, el usuario acepta cumplir los
              siguientes términos y condiciones. Estos términos regulan el uso de la plataforma, la contratación de
              servicios y la interacción con nuestro personal técnico y administrativo.
            </Paragraph>
          </Section>

          <Section>
            <Title>1. Uso de la Plataforma</Title>
            <Paragraph>
              El usuario se compromete a utilizar esta plataforma exclusivamente para solicitar servicios ofrecidos
              por A&C Soluciones. Está prohibido el uso indebido, incluyendo suplantación de identidad, manipulación
              de información o actividades fraudulentas.
            </Paragraph>
          </Section>

          <Section>
            <Title>2. Registro y Cuenta</Title>
            <Paragraph>
              Para acceder a ciertos servicios, el usuario debe registrarse proporcionando información veraz y actualizada.
              Es responsabilidad del usuario mantener la confidencialidad de su contraseña y notificar cualquier uso
              no autorizado de su cuenta.
            </Paragraph>
          </Section>

          <Section>
            <Title>3. Solicitud y Prestación de Servicios</Title>
            <Paragraph>
              Una vez realizada la solicitud de un servicio, A&C programará la visita técnica según disponibilidad.
              El cliente se compromete a brindar acceso adecuado y seguro a las instalaciones. El servicio solo será
              considerado completo una vez se emita el informe técnico correspondiente.
            </Paragraph>
          </Section>

          <Section>
            <Title>4. Políticas de Pago</Title>
            <Paragraph>
              El usuario deberá pagar el valor acordado por los servicios contratados. El incumplimiento en el pago
              podrá conllevar la suspensión del servicio o acciones legales, según corresponda.
            </Paragraph>
          </Section>

          <Section>
            <Title>5. Cancelaciones y Reprogramaciones</Title>
            <Paragraph>
              El cliente podrá cancelar o reprogramar una visita técnica con al menos 24 horas de antelación. De lo
              contrario, A&C podrá cobrar una tarifa por desplazamiento y disponibilidad del técnico.
            </Paragraph>
          </Section>

          <Section>
            <Title>6. Responsabilidad</Title>
            <Paragraph>
              A&C no se hace responsable por daños causados por mal uso de los equipos o por intervenciones externas
              no autorizadas. La garantía de los servicios aplica solo si se respetan las condiciones de uso indicadas
              por el técnico.
            </Paragraph>
          </Section>

          <Section>
            <Title>7. Protección de Datos</Title>
            <Paragraph>
              Toda la información personal suministrada será tratada conforme a nuestra política de privacidad y a
              la Ley 1581 de 2012 sobre protección de datos personales en Colombia.
            </Paragraph>
          </Section>

          <Section>
            <Title>8. Modificaciones</Title>
            <Paragraph>
              A&C Soluciones Hidroeléctricas se reserva el derecho de modificar estos términos en cualquier momento.
              El uso continuado de la plataforma implica la aceptación de los cambios.
            </Paragraph>
          </Section>

          <Section>
            <Title>9. Jurisdicción</Title>
            <Paragraph>
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier conflicto será resuelto
              ante las autoridades competentes en la ciudad de Palmira, Valle del Cauca.
            </Paragraph>
          </Section>
        </ContainerPage>
      </ContainerContent>

      {userRole !== "cliente" && <FooterHome />}
    </ContainerPageAll>
  );
};

export default TermsAndConditionsPage;
