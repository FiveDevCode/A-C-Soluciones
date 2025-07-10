import { 
  faBriefcase,
  faCalendarAlt,
  faCalendarCheck, 
  faCheckCircle, 
  faClipboardList, 
  faFileAlt, 
  faInbox,
  faPlayCircle,
  faTimesCircle,
  faTruck, 
} from "@fortawesome/free-solid-svg-icons";
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


const CategoryRecomendTc = () => {
  return (
    <ContainerCategory>
      <h1>Categorias recomendadas</h1>
      <ContainerOption>
        <Option to="/tecnico/visitas">
          <Icon icon={faClipboardList} style={{ stroke: "#17A2B8" }} />
          <OptionTitle>Visitas</OptionTitle>
        </Option>
        <Option to="/tecnico/visitas-programadas">
          <Icon icon={faCalendarAlt} style={{ stroke: "#4a8838" }} />
          <OptionTitle>Visitas programadas</OptionTitle>
        </Option>
        <Option to="/tecnico/visitas-en-camino">
          <Icon icon={faTruck} style={{ stroke: "#a72063" }} />
          <OptionTitle>Visitas en camino</OptionTitle>
        </Option>
        <Option to="/tecnico/visitas-iniciadas">
          <Icon icon={faPlayCircle} style={{ stroke: "#3151aa" }} />
          <OptionTitle>Visitas iniciadas</OptionTitle>
        </Option>
        <Option to="/tecnico/visitas-completadas">
          <Icon icon={faCheckCircle} style={{ stroke: "#21da21" }} />
          <OptionTitle>Visitas completadas</OptionTitle>
        </Option>
        <Option to="/tecnico/visitas-canceladas">
          <Icon icon={faTimesCircle} style={{ stroke: "#b8103a" }} />
          <OptionTitle>Visitas canceladas</OptionTitle>
        </Option>
              </ContainerOption>
    </ContainerCategory>
  )
}


export default CategoryRecomendTc;
