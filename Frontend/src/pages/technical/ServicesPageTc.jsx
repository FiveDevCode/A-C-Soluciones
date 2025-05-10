import styled from "styled-components";
import FilterServicesTc from "../../components/technical/FilterServicesTc";
import ListSevicesTc from "../../components/technical/ListSevicesTc";

const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`


const ServicesPageTc = () => {
  return (
    <ContainerServices>

      <FilterServicesTc />
      <ListSevicesTc />

    </ContainerServices>
  )
}

export default ServicesPageTc;