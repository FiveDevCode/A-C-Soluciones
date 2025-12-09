import { 
  faBriefcase, 
  faCalculator, 
  faCalendarCheck, 
  faCreditCard, 
  faCreditCardAlt, 
  faFile, 
  faFileAlt, 
  faFileInvoiceDollar, 
  faInbox, 
  faMoneyBills, 
  faPlusSquare, 
  faTasks, 
  faTools, 
  faUserGear, 
  faUserPlus, 
  faUsers, 
  faUserShield, 
  faUserTie,
  faWrench} from "@fortawesome/free-solid-svg-icons";
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
  
  &:hover {
    background: linear-gradient(90deg, #e4d9ff 0%, #f5f5ff 100%);
    cursor: pointer;

    h2 {
      font-weight: bold;
    }

    svg {
      color: #000000;
      stroke-width: 0;

    }
  }

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
      <h1>Categorías recomendadas</h1>
      <ContainerOption>
        {/* <Option to="/admin/reportes">
          <Icon icon={faFile} style={{stroke:"#28A745"}}/>
          <OptionTitle>Reportes</OptionTitle>
        </Option> */}
        <Option to="/admin/registrar-inventario">
          <Icon icon={faTools} style={{stroke:"#28A745"}}/>
          <OptionTitle>Registra una nueva herramienta</OptionTitle>
        </Option>
        <Option to="/admin/registrar-empleado">
          <Icon icon={faUserPlus} style={{stroke:"#28A745"}}/>
          <OptionTitle>Registra un empleado</OptionTitle>
        </Option>
        <Option to="/admin/registrar-servicio">
          <Icon icon={faPlusSquare} style={{stroke:"#007BFF"}}/>
          <OptionTitle>Crea un nuevo servicio</OptionTitle>
        </Option>
        <Option to="/admin/asignar-visita">
          <Icon icon={faTasks} style={{stroke:"#FD7E14"}}/>
          <OptionTitle>Asigna una visita</OptionTitle>
        </Option>
        <Option to="/admin/registrar-administrador">
          <Icon icon={faUserShield} style={{stroke:"#6F42C1"}}/>
          <OptionTitle>Crear nuevo administrador</OptionTitle>
        </Option>
        <Option to="/admin/registrar-contador">
          <Icon icon={faFileInvoiceDollar} style={{ stroke: "#6F42C1" }} />
          <OptionTitle>Crear nuevo contador</OptionTitle>
        </Option>
        
        <Option to="/admin/registrar-factura">
          <Icon icon={faMoneyBills} style={{ stroke: "#1ac762" }} />
          <OptionTitle>Crear nueva factura</OptionTitle>
        </Option>

        <Option to="/admin/registrar-cuenta">
          <Icon icon={faCreditCardAlt} style={{ stroke: "#1ac762" }} />
          <OptionTitle>Crear nueva factura</OptionTitle>
        </Option>
      </ContainerOption>
    </ContainerCategory>
  )
}


export default CategoryRecomendAd;
