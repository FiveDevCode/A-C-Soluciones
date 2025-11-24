import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FormControl, TextField } from "@mui/material";


const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #91cdffff;
    transform: translateY(-2px);
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const ContainerOption = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
`;

const TitleNoti = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DateText = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #94a3b8;
  margin: 0;
`;

const SeeMore = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #91cdffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e3f2fd;
    color: #60a5fa;
  }
`;

const MoreButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #91cdffff 0%, #60a5fa 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.875rem 2rem;
  margin-top: 1rem;
  align-self: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(145, 205, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(145, 205, 255, 0.4);
  }
`;




const ActivityListTc = ({visits}) => {




  const getEstadoLabel = (estado) => {
    const estados = {
      'programada': 'Programada',
      'en_camino': 'En camino',
      'iniciada': 'Iniciada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado] || estado;
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'programada': '#4a8838',
      'en_camino': '#a72063',
      'iniciada': '#3151aa',
      'completada': '#21da21',
      'cancelada': '#b8103a'
    };
    return colores[estado] || '#64748b';
  };

  return (
    <ContainerNoti>
      {Array.isArray(visits) && visits.length > 0 ? (
        <>
          {visits.slice(0, 4).map((visit, index) => (
            <Notification key={visit.id || index}>
              <NotificationDescription>
                <ImageWrapper>
                  <img src={serviceTehc} alt="Servicio" />
                </ImageWrapper>
                <NotificationInfo>
                  <TitleNoti>
                    {visit.notas_posteriores && visit.notas_posteriores.length > 50
                      ? `${visit.notas_posteriores.slice(0, 50)}...`
                      : visit.notas_posteriores || "No hay notas posteriores"}
                  </TitleNoti>
                  <Description>
                    {visit.notas_previas && visit.notas_previas.length > 50
                      ? `${visit.notas_previas.slice(0, 50)}...`
                      : visit.notas_previas || "No hay notas previas"}
                  </Description>
                  <DateText>
                    {visit.fecha_programada 
                      ? new Date(visit.fecha_programada).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Fecha no disponible'}
                  </DateText>
                </NotificationInfo>
              </NotificationDescription>
              <ContainerOption>
                <FormControl sx={{ minWidth: "150px" }}>
                  <TextField
                    value={getEstadoLabel(visit.estado)}
                    label="Estado"
                    disabled
                    sx={{
                      '& .MuiInputBase-root': {
                        color: getEstadoColor(visit.estado),
                        fontWeight: 600,
                      }
                    }}
                  />
                </FormControl>
                <SeeMore to={`/tecnico/visita/${visit.id}`}>
                  <span>Ver más</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </SeeMore>
              </ContainerOption>
            </Notification>
          ))}
          {visits.length > 4 && (
            <MoreButton to="/tecnico/visitas">
              Ver más visitas
              <FontAwesomeIcon icon={faArrowRight} />
            </MoreButton>
          )}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: '#64748b',
          fontSize: '1rem'
        }}>
          No tienes ninguna actividad asignada por el momento.
        </div>
      )}
    </ContainerNoti>
  );
}


export default ActivityListTc;