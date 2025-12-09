import { useState, useEffect } from "react";
import styled from "styled-components";
import { commonService } from "../../services/common-service";

const DisponibilidadContainer = styled.div`
  margin: 12px 0;
  border: 1px solid #e0e7ff;
  border-radius: 8px;
  background: linear-gradient(to bottom, #ffffff, #fafbff);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.1);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 12px 14px;
  background: ${props => props.$isExpanded ? 
    'linear-gradient(to right, #eef2ff, #e0e7ff)' : 
    'linear-gradient(to right, #f8fafc, #f1f5f9)'
  };
  border-bottom: ${props => props.$isExpanded ? '2px solid #6366f1' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(to right, #eef2ff, #ddd6fe);
  }
`;

const Title = styled.h4`
  margin: 0;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: "📅";
    font-size: 16px;
  }
`;

const ToggleIcon = styled.span`
  color: #6366f1;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.2s ease;
  transform: ${props => props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ContentWrapper = styled.div`
  max-height: ${props => props.$isExpanded ? '600px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const ContentInner = styled.div`
  padding: 14px;
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #1e40af;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
  
  &::before {
    content: "ℹ️";
    margin-right: 6px;
    font-size: 14px;
  }
`;

const Section = styled.div`
  margin-bottom: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$error ? '#dc2626' : props.$warning ? '#d97706' : '#059669'};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: ${props => props.$error ? '"🔴"' : '"✅"'};
    font-size: 13px;
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 12px;
  margin: 0;
  padding: 14px;
`;

const HorariosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HorarioItem = styled.div`
  background: ${props => props.$sufficient ? 
    'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
  };
  border-left: 4px solid ${props => props.$sufficient ? '#22c55e' : '#f59e0b'};
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const HorarioTime = styled.div`
  font-weight: 600;
  color: ${props => props.$sufficient ? '#15803d' : '#b45309'};
  font-size: 13px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: "🕐";
    font-size: 14px;
  }
`;

const HorarioDuration = styled.div`
  color: #4b5563;
  font-size: 11px;
  line-height: 1.5;
`;

const OcupadoItem = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-left: 4px solid #ef4444;
  border-radius: 6px;
  padding: 9px 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #991b1b;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.1);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  strong {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    
    &::before {
      content: "⏰";
      font-size: 13px;
    }
  }
`;

const DisponibilidadTecnico = ({ tecnicoId, fecha, duracionEstimada, defaultExpanded = false }) => {
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (!tecnicoId || !fecha) {
      setDisponibilidad(null);
      return;
    }

    const fetchDisponibilidad = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await commonService.getDisponibilidadTecnico(tecnicoId, fecha);
        setDisponibilidad(response.data.data);
      } catch (err) {
        console.error("Error al obtener disponibilidad:", err);
        setError("No se pudo obtener la disponibilidad del técnico");
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();
  }, [tecnicoId, fecha]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    // Convertir explícitamente a hora de Colombia (UTC-5)
    const colombiaTime = new Date(date.toLocaleString("en-US", { timeZone: "America/Bogota" }));
    let hours = colombiaTime.getHours();
    const minutes = String(colombiaTime.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  if (!tecnicoId || !fecha) {
    return null;
  }

  if (loading) {
    return (
      <DisponibilidadContainer>
        <TitleContainer onClick={() => setIsExpanded(!isExpanded)} $isExpanded={isExpanded}>
          <Title>Verificando disponibilidad...</Title>
          <ToggleIcon $isExpanded={isExpanded}>▼</ToggleIcon>
        </TitleContainer>
        <ContentWrapper $isExpanded={isExpanded}>
          <LoadingText>Consultando horarios del técnico...</LoadingText>
        </ContentWrapper>
      </DisponibilidadContainer>
    );
  }

  if (error) {
    return (
      <DisponibilidadContainer>
        <TitleContainer onClick={() => setIsExpanded(!isExpanded)} $isExpanded={isExpanded}>
          <Title>Disponibilidad del técnico</Title>
          <ToggleIcon $isExpanded={isExpanded}>▼</ToggleIcon>
        </TitleContainer>
        <ContentWrapper $isExpanded={isExpanded}>
          <ContentInner>
            <SectionTitle $error>{error}</SectionTitle>
          </ContentInner>
        </ContentWrapper>
      </DisponibilidadContainer>
    );
  }

  if (!disponibilidad) {
    return null;
  }

  const { tecnico, horariosDisponibles, intervalosOcupados } = disponibilidad;

  return (
    <DisponibilidadContainer>
      <TitleContainer onClick={() => setIsExpanded(!isExpanded)} $isExpanded={isExpanded}>
        <Title>Disponibilidad de {tecnico.nombre}</Title>
        <ToggleIcon $isExpanded={isExpanded}>▼</ToggleIcon>
      </TitleContainer>
      <ContentWrapper $isExpanded={isExpanded}>
        <ContentInner>
          <InfoBanner>
            Horario laboral: 8:00 AM - 6:00 PM<br/>
            Los bloques libres muestran períodos donde puede programar la visita
          </InfoBanner>
      
          {intervalosOcupados.length > 0 && (
            <Section>
              <SectionTitle $error>Visitas ya programadas:</SectionTitle>
              {intervalosOcupados.map((intervalo, index) => (
                <OcupadoItem key={index}>
                  <strong>{formatTime(intervalo.inicio)} - {formatTime(intervalo.fin)}</strong>
                  <span style={{ marginLeft: '8px', fontSize: '11px', opacity: 0.8 }}>
                    ({intervalo.duracion} min)
                  </span>
                </OcupadoItem>
              ))}
            </Section>
          )}

          {horariosDisponibles.length === 0 ? (
            <SectionTitle $error>El técnico no tiene horarios disponibles para esta fecha.</SectionTitle>
          ) : (
            <Section>
              <SectionTitle>Horarios disponibles:</SectionTitle>
              <HorariosList>
                {horariosDisponibles.map((horario, index) => {
                  const suficiente = duracionEstimada ? 
                    horario.duracionDisponible >= parseInt(duracionEstimada) : true;
                  
                  return (
                    <HorarioItem 
                      key={index}
                      $sufficient={suficiente}
                    >
                      <HorarioTime $sufficient={suficiente}>
                        {formatTime(horario.inicio)} - {formatTime(horario.fin)}
                      </HorarioTime>
                      <HorarioDuration>
                        Bloque libre de {horario.duracionDisponible} minutos
                        {duracionEstimada && (
                          <>
                            <br/>
                            {suficiente ? (
                              <span style={{ color: '#15803d', fontWeight: 600 }}>
                                ✓ Puede programar su visita de {duracionEstimada} min aquí
                              </span>
                            ) : (
                              <span style={{ color: '#b45309' }}>
                                ✗ Insuficiente para {duracionEstimada} min
                              </span>
                            )}
                          </>
                        )}
                      </HorarioDuration>
                    </HorarioItem>
                  );
                })}
              </HorariosList>
            </Section>
          )}
        </ContentInner>
      </ContentWrapper>
    </DisponibilidadContainer>
  );
};

export default DisponibilidadTecnico;