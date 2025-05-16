import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../../components/common/Logo";
import { FormControl, TextField } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


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



const ListSevicesTc = ({services}) => {

  return (
    <ContainerNoti>
      {services.map((service, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={serviceTehc}/>
            <NotificationInfo>
              <TitleNoti>
                {service.notas_posteriores.length > 50
                  ? `${service.notas_posteriores.slice(0, 50)}...`
                  : service.notas_posteriores}
              </TitleNoti>
              <Description>
                {service.notas_previas.length > 50
                  ? `${service.notas_previas.slice(0, 50)}...`
                  : service.notas_previas}
              </Description>
              <Date>{service.fecha_programada.substring(0, 10)}</Date>
            </NotificationInfo>
          </NotificationDescription>
          <ContainerOption>
            <FormControl sx={{ width: "30%", minWidth: "200px" }}>
              <TextField
                value={service.estado}
                label="Estado"
                disabled
              />
            </FormControl>
            <SeeMore>
              <FontAwesomeIcon icon={faArrowRight} />
              <Link to={`/view-service/${service.id}`}>Ver</Link>
            </SeeMore>
          </ContainerOption>
        </Notification>
      ))}
    </ContainerNoti>
  );
};

export default ListSevicesTc;
