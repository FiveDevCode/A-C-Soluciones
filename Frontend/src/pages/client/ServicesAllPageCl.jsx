import styled from "styled-components";
import { handleGetServiceList } from "../../controllers/client/getServiceListCl.controller";
import { useEffect, useState } from "react";
import ServiceOpenCl from "../../components/client/ServiceOpenCl";
import getIconByService from "../../components/client/GetIconServiceCl";



const ContainerServices = styled.section`
  display: flex;
  flex-direction: column;

`

const ContentServices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0 8rem;
  padding-bottom: 5rem;
  padding-top: 2rem;
`

const TitleServices = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0 8rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  box-shadow: 1px 0px rgba(0, 0, 0, 0.25);
  padding-top: 1rem;
`

const Service = styled.div`
  width: calc((100% - 3 * 1.25rem) / 4);
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  }


  & > :first-child{
    margin-bottom: 0.5rem;
  }
  
`

const TitleService = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #505050;
`
const Description = styled.h3`
  font-size: 1rem;
  font-weight: bold;
`


const ServicesAllPageCl = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // nuevo estado

  useEffect(() => {
    handleGetServiceList()
      .then((response) => {
        console.log("Respuesta del servicio:", response);
        setServices(response.data.data); // asumiendo que response es un array
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);



  return (
    <ContainerServices>
      <TitleServices>Elige el servicio que necesitas:</TitleServices>
      <ContentServices>
        {services.map((service) => (
          <Service key={service.id} onClick={() => setSelectedService(service)}>
            {getIconByService(service.nombre)}
            <TitleService>{service.nombre}</TitleService>
            <Description title={service.descripcion}>
              {service.descripcion.length > 30
                ? service.descripcion.slice(0, 60) + "..."
                : service.descripcion}
            </Description>
          </Service>
        ))}
      </ContentServices>
      {selectedService && (
        <ServiceOpenCl
          servicio={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </ContainerServices>
    
  )
}


export default ServicesAllPageCl;