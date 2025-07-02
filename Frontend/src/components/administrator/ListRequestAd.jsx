import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../common/Logo";
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

const ListRequestAd = ({requests}) => {
  return (
    <ContainerNoti>
      {requests.map((request, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={serviceTehc}/>
            <NotificationInfo>
              <TitleNoti>
                {request.direccion_servicio && request.direccion_servicio.length > 50
                  ? `${request.direccion_servicio.slice(0, 50)}...`
                  : request.direccion_servicio || "Sin dirrecion"
                }
              </TitleNoti>
              <Description>
                {request.descripcion && request.descripcion.length > 50
                  ? `${request.descripcion.slice(0, 50)}...`
                  : request.descripcion || "Sin descripcion"
                }
              </Description>
              <Date>{request.fecha_solicitud.substring(0, 10)}</Date>
            </NotificationInfo>
          </NotificationDescription>
          <ContainerOption>
            <FormControl sx={{ width: "30%", minWidth: "200px" }}>
              <TextField
                value={request.estado}
                label="Estado"
                disabled
              />
            </FormControl>
            <SeeMore>
              <FontAwesomeIcon icon={faArrowRight} />
              <Link to={`/admin/solicitud/${request.id}`}>Ver</Link>
            </SeeMore>
          </ContainerOption>
        </Notification>
      ))}
    </ContainerNoti>
  );
}

export default ListRequestAd;