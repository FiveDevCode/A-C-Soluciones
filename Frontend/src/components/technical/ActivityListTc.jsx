import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../../components/common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";


const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.25);
  padding-left: 1rem;
  padding-right: 5rem;
  justify-content: space-between;
  
  &:first-child{
    border-radius: 5px 5px 0 0;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContainerOption = styled.div`
  display: flex;
  gap: 4rem;
  width: 50%;
  justify-content: end;
`

const TitleNoti = styled.h2`
  font-size: 1rem;
  font-weight: lighter;
`;

const Description = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const Date = styled.h2`
  font-size: 1rem;
  font-weight: normal;
`;

const SeeMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`





const ActivityListTc = ({visits}) => {




  return (
    <ContainerNoti>
      {Array.isArray(visits) && visits.slice(0, 4).map((visit, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={serviceTehc} />
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
              <Date>{visit.fecha_programada.substring(0, 10)}</Date>
            </NotificationInfo>
          </NotificationDescription>
          <ContainerOption>
            <SeeMore>
              <FontAwesomeIcon icon={faTrash} />
              <Link to="/">Eliminar</Link>
            </SeeMore>
            <SeeMore>
              <FontAwesomeIcon icon={faArrowRight} />
              <Link to={`/tecnico/ver-visita/${visit.id}`}>Ver</Link>
            </SeeMore>
          </ContainerOption>
        </Notification>
      ))}
    </ContainerNoti>
  );
}


export default ActivityListTc;