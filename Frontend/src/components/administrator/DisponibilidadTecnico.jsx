import { useState, useEffect } from "react";
import styled from "styled-components";
import { commonService } from "../../services/common-service";

const DisponibilidadContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const Title = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 13px;
  margin: 5px 0;
`;

const NoDisponibleText = styled.p`
  color: #d32f2f;
  font-size: 13px;
  font-weight: 500;
  margin: 10px 0;
`;

const HorariosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const HorarioItem = styled.div`
  background: white;
  padding: 10px;
  border-radius: 6px;
  border-left: 4px solid #4caf50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HorarioTime = styled.div`
  font-weight: 600;
  color: #2e7d32;
  font-size: 14px;
  margin-bottom: 4px;
`;

const HorarioDuration = styled.div`
  color: #666;
  font-size: 12px;
`;

const IntervalosOcupados = styled.div`
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
`;

const OcupadoItem = styled.div`
  background: #ffe6e6;
  padding: 8px;
  border-radius: 4px;
  border-left: 4px solid #f44336;
  margin-bottom: 6px;
  font-size: 12px;
  color: #c62828;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 12px;
  margin: 8px 0 0 0;
  font-style: italic;
`;

const DisponibilidadTecnico = ({ tecnicoId, fecha, duracionEstimada }) => {
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!tecnicoId || !fecha) {
    return null;
  }

  if (loading) {
    return (
      <DisponibilidadContainer>
        <Title>🕐 Verificando disponibilidad...</Title>
        <LoadingText>Consultando horarios del técnico...</LoadingText>
      </DisponibilidadContainer>
    );
  }

  if (error) {
    return (
      <DisponibilidadContainer>
        <Title>⚠️ Error</Title>
        <NoDisponibleText>{error}</NoDisponibleText>
      </DisponibilidadContainer>
    );
  }

  if (!disponibilidad) {
    return null;
  }

  const { tecnico, horariosDisponibles, intervalosOcupados } = disponibilidad;

  return (
    <DisponibilidadContainer>
      <Title>
        📅 Disponibilidad de {tecnico.nombre}
      </Title>
      <InfoText style={{ marginBottom: '10px' }}>
        💡 Horario laboral: 8:00 AM - 6:00 PM
      </InfoText>
      
      {intervalosOcupados.length > 0 && (
        <IntervalosOcupados style={{ marginTop: 0, marginBottom: '15px', paddingTop: 0, borderTop: 'none' }}>
          <LoadingText style={{ color: '#d32f2f', fontWeight: 600 }}>🔴 Visitas ya programadas:</LoadingText>
          {intervalosOcupados.map((intervalo, index) => (
            <OcupadoItem key={index}>
              <strong>{formatTime(intervalo.inicio)} - {formatTime(intervalo.fin)}</strong>
              <span style={{ marginLeft: '8px', fontSize: '11px' }}>({intervalo.duracion} minutos)</span>
            </OcupadoItem>
          ))}
        </IntervalosOcupados>
      )}

      {horariosDisponibles.length === 0 ? (
        <NoDisponibleText>
          ❌ El técnico no tiene horarios disponibles para esta fecha.
        </NoDisponibleText>
      ) : (
        <>
          <LoadingText style={{ color: '#2e7d32', fontWeight: 600 }}>✅ Horarios disponibles:</LoadingText>
          <HorariosList>
            {horariosDisponibles.map((horario, index) => {
              const suficiente = duracionEstimada ? 
                horario.duracionDisponible >= parseInt(duracionEstimada) : true;
              
              return (
                <HorarioItem 
                  key={index}
                  style={{ 
                    borderLeftColor: suficiente ? '#4caf50' : '#ff9800',
                    background: suficiente ? 'white' : '#fff3e0'
                  }}
                >
                  <HorarioTime style={{ color: suficiente ? '#2e7d32' : '#e65100' }}>
                    {formatTime(horario.inicio)} - {formatTime(horario.fin)}
                  </HorarioTime>
                  <HorarioDuration>
                    Duración disponible: {horario.duracionDisponible} minutos
                    {duracionEstimada && !suficiente && (
                      <span style={{ color: '#e65100', marginLeft: '8px' }}>
                        (Insuficiente para {duracionEstimada} min)
                      </span>
                    )}
                  </HorarioDuration>
                </HorarioItem>
              );
            })}
          </HorariosList>
        </>
      )}
    </DisponibilidadContainer>
  );
};

export default DisponibilidadTecnico;
