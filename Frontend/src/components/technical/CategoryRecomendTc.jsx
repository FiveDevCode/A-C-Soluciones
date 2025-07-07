import { 
  faBriefcase,
  faCalendarCheck, 
  faFileAlt, 
  faInbox, 
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
          <Icon icon={faCalendarCheck} style={{stroke:"#17A2B8"}}/>
          <OptionTitle>Visitas</OptionTitle>
        </Option>
      </ContainerOption>
    </ContainerCategory>
  )
}


export default CategoryRecomendTc;
