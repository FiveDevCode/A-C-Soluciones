import styled from "styled-components";

const ContainerInfo = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
`;

const TitleSearch = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  letter-spacing: -0.01em;
`;

const FilterServicesAd = ({ count }) => {
  return (
    <ContainerInfo>
      <TitleSearch>
        Se encontraron {count} {count === 1 ? 'resultado' : 'resultados'}
      </TitleSearch>
    </ContainerInfo>
  );
};


export default FilterServicesAd;