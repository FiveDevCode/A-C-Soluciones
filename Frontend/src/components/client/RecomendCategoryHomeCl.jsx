import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { handleGetService } from "../../controllers/administrator/getServiceAd.controller";
import { useEffect, useState } from "react";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import ServiceOpenCl from "./ServiceOpenCl";

const FullWidthCard = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  padding: 3rem 4rem;
  border-left: 6px solid ${({ highlightColor }) => highlightColor || '#007bff'};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  gap: 3rem;
  position: relative;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
  }
`;

const RecommendedTag = styled.span`
  position: absolute;
  top: 1.2rem;
  left: 1rem;
  background-color: ${({ color }) => color || '#007bff'};
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media screen and (max-width: 768px) {
    position: static;
    margin-bottom: 1rem;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

const IconBox = styled.div`
  background-color: ${({ color }) => color || '#007bff'};
  color: #fff;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2rem;
  }
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.7rem;
  margin: 0;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #666;
  margin: 0;
`;

const ActionButton = styled(Link)`
  background-color: ${({ color }) => color || '#007bff'};
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.3s;
  width: fit-content;

  &:hover {
    background-color: #0056b3;
  }

  @media screen and (max-width: 1024px) {
    align-self: center;
  }
`;

const RightIllustration = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  img {
    width: 100%;
    max-width: 240px;
    object-fit: contain;
  }

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const RecommendedServiceFullWidth = ({
  id,
  color = "#007bff",
  tag = "Recomendado",
  image // opcional: URL o import de imagen ilustrativa
}) => {

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  useEffect(() => {
    handleGetService(id)
      .then(res => {
        setService(res.data.data); // o donde esté el dato
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener servicio recomendado:", err);
        setError("No se pudo cargar el servicio.");
        setLoading(false);
      });
  }, [id]);
  if (loading) return null; // o un spinner
  if (error || !service) return null;

  return (
    <FullWidthCard highlightColor={color}>
      <RecommendedTag color={color}>{tag}</RecommendedTag>
      <LeftContent>
        <IconBox color={color}>
          <FontAwesomeIcon icon={faTasks} />
        </IconBox>
        <TextSection>
          <Title>{service.nombre}</Title>
          <Description>{service.descripcion}</Description>
          <ActionButton onClick={() => setSelectedService(service)} color={color}>
            Ver más
          </ActionButton>
        </TextSection>
      </LeftContent>
      {image && (
        <RightIllustration>
          <img src={image} alt="Ilustración del servicio" />
        </RightIllustration>
      )}
      {selectedService && (
        <ServiceOpenCl
          servicio={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </FullWidthCard>
  );
};

export default RecommendedServiceFullWidth;
