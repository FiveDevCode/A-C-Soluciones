import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"


const ContainerInfo = styled.section`
  display: flex;
  gap: 0.425rem;
`

const TitleSearch = styled.h1`
  font-size: 1rem;
  font-weight: bold;
`



const FilterServicesTc = () => {
  return (
    <ContainerInfo>
      <TitleSearch>Se encontraron 56 resultados    |   filtros</TitleSearch>
      <FontAwesomeIcon data-testid="filter-icon" icon={faFilter} style={{fontSize:"20px"}}/>
    </ContainerInfo>
  )
}


export default FilterServicesTc;