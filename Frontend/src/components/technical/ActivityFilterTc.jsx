import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";




const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a237e;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Divider = styled.div`
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #e2e8f0 0%, transparent 100%);
`;

const ActivityFilterTc = () => {
  return (
    <Container>
      <Title>Actividades</Title>
      <Divider />
    </Container>
  );
};


export default ActivityFilterTc;