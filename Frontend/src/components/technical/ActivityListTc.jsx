import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../../components/common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";
import { FormControl, TextField } from "@mui/material";


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

const MoreButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f1ff;
  border: 1px solid #343875;
  color: #343875;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  align-self: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: #343875;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;




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
            <FormControl sx={{ width: "30%", minWidth: "200px" }}>
              <TextField
                value={visit.estado === "en_camino" ? "en camino" : visit.estado === "en_camino" ? "en camino" : visit.estado === "en_camino" ? "en camino" : visit.estado}
                label="Estado"
                disabled
              />
            </FormControl>
            <Link to={`/tecnico/visita/${visit.id}`} style={{ textDecoration: 'none', alignSelf: "center"}}>
              <SeeMore style={{ cursor: 'pointer', color: '#343875' }}>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Ver</span>
              </SeeMore>
            </Link>
          </ContainerOption>
        </Notification>
      ))}
      <MoreButton to="/tecnico/visitas">
        Ver más visitas <FontAwesomeIcon icon={faArrowRight} />
      </MoreButton>
    </ContainerNoti>
  );
}


export default ActivityListTc;