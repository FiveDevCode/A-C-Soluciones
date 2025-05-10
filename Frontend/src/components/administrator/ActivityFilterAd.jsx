import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";




const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: sans-serif;
`;


const Divider = styled.span`
  height: 1rem;
  border-left: 1px solid black;
  margin: 0 0.5rem;
`;

const FilterText = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  color: #000000;
`;





const ActivityFilterAd = () => {
  return (
    <Container>
      <span>Actividades</span>
      <Divider />
      <FilterText>
        filtros <FontAwesomeIcon icon={faFilter} />
      </FilterText>
    </Container>
  )
}


export default ActivityFilterAd;