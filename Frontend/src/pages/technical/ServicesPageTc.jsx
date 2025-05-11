import styled from "styled-components";
import FilterServicesTc from "../../components/technical/FilterServicesTc";
import ListSevicesTc from "../../components/technical/ListSevicesTc";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";

const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`


const ServicesPageTc = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    handleGetServiceList()
      .then((res) => {
        setServices(res.data.data); // ajusta según respuesta real
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, []);


  return (
    <ContainerServices>

      <FilterServicesTc count={services.length} />
      <ListSevicesTc services={services} />

    </ContainerServices>
  )
}

export default ServicesPageTc;