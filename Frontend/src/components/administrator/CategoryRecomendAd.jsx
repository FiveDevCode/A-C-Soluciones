import { 
  faBriefcase, 
  faCalendarCheck, 
  faFileAlt, 
  faInbox, 
  faPlusSquare, 
  faTasks, 
  faUserPlus, 
  faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ContainerCategory = styled.section`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 10px;
  padding: 1rem;
  gap: 1rem;
`

const ContainerOption = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const Option = styled(Link)`
  display: flex;
  gap: 1rem;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 5px;
  align-items: center;
  padding: 0 1rem;
  width: calc((100% - 3rem) / 4);
  height: 60px;
  

`

const Icon = styled(FontAwesomeIcon)`
  color: #FFFFFF;
  font-size: 1.5rem;  
  stroke-width: 2rem;
`

const OptionTitle = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  

`


const CategoryRecomendAd = () => {
  return (
    <ContainerCategory>
      <h1>Categorias recomendadas</h1>
      <ContainerOption>
        <Option to="/register-employee">
          <Icon icon={faUserPlus} style={{stroke:"#28A745"}}/>
          <OptionTitle>Registra un empleado</OptionTitle>
        </Option>
        <Option to="/register-service">
          <Icon icon={faPlusSquare} style={{stroke:"#007BFF"}}/>
          <OptionTitle>Crea un nuevo servicio</OptionTitle>
        </Option>
        <Option to="/assing-visit">
          <Icon icon={faTasks} style={{stroke:"#FD7E14"}}/>
          <OptionTitle>Asigna una visita</OptionTitle>
        </Option>
        <Option to="/">
          <Icon icon={faInbox} style={{stroke:"#343A40"}}/>
          <OptionTitle>Solicitudes de clientes</OptionTitle>
        </Option>
        <Option to="/">
          <Icon icon={faUserShield} style={{stroke:"#6F42C1"}}/>
          <OptionTitle>Crear nuevo administrador</OptionTitle>
        </Option>
        <Option to="/">
          <Icon icon={faFileAlt} style={{stroke:"#6C757D"}}/>
          <OptionTitle>Crear ficha de 
          mantenimiento</OptionTitle>
        </Option>
        <Option to="/">
          <Icon icon={faCalendarCheck} style={{stroke:"#17A2B8"}}/>
          <OptionTitle>Visitas programadas</OptionTitle>
        </Option>
        <Option to="/">
          <Icon icon={faBriefcase} style={{stroke:"#E67E22"}}/>
          <OptionTitle>Servicios en curso</OptionTitle>
        </Option>
      </ContainerOption>
    </ContainerCategory>
  )
}


export default CategoryRecomendAd;
