import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../../components/common/Logo";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from "react";
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
  border-radius: 3px 5px 0 0;
  padding-left: 1rem;
  padding-right: 5rem;
  justify-content: space-between;
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



const ListSevicesTc = () => {

  const [state, setState] = useState("Pendiente");

  const handleChange = (e) => {
    setState(e.target.value)
  }

  return (
    <ContainerNoti>
      <Notification>
        <NotificationDescription>
          <Logo src={serviceTehc}/>
          <NotificationInfo>
            <TitleNoti>Inspección del sistema de enfriamiento del generador</TitleNoti>
            <Description>Técnico asignado visitará la Central Hidráulica Río Claro para ...</Description>
            <Date>15/04/2025 10:30 AM</Date>
          </NotificationInfo>
        </NotificationDescription>
        <ContainerOption>          
          <FormControl sx={{width:"30%", minWidth:"200px"}}>
            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
          <SeeMore>
            <FontAwesomeIcon icon={faArrowRight} />
            <Link to="/">Ver</Link>
          </SeeMore>
        </ContainerOption>
      </Notification>
      <Notification>
        <NotificationDescription>
          <Logo src={serviceTehc}/>
          <NotificationInfo>
            <TitleNoti>Inspección del sistema de enfriamiento del generador</TitleNoti>
            <Description>Técnico asignado visitará la Central Hidráulica Río Claro para ...</Description>
            <Date>15/04/2025 10:30 AM</Date>
          </NotificationInfo>
        </NotificationDescription>
        <ContainerOption>          
          <FormControl sx={{width:"30%", minWidth:"200px"}}>
            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value="Pendiente">Pediente</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
          <SeeMore>
            <FontAwesomeIcon icon={faArrowRight} />
            <Link to="/">Ver</Link>
          </SeeMore>
        </ContainerOption>
      </Notification>

      <Notification>
        <NotificationDescription>
          <Logo src={serviceTehc}/>
          <NotificationInfo>
            <TitleNoti>Inspección del sistema de enfriamiento del generador</TitleNoti>
            <Description>Técnico asignado visitará la Central Hidráulica Río Claro para ...</Description>
            <Date>15/04/2025 10:30 AM</Date>
          </NotificationInfo>
        </NotificationDescription>
        <ContainerOption>          
          <FormControl sx={{width:"30%", minWidth:"200px"}}>
            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value="Pendiente">Pediente</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
          <SeeMore>
            <FontAwesomeIcon icon={faArrowRight} />
            <Link to="/">Ver</Link>
          </SeeMore>
        </ContainerOption>
      </Notification>



    </ContainerNoti>
  )
}

export default ListSevicesTc;
