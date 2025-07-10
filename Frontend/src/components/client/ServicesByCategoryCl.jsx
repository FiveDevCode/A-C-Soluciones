import styled from "styled-components";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { handleGetServiceList } from "../../controllers/client/getServiceListCl.controller";
import getIconByService from "./GetIconServiceCl";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ServiceOpenCl from "./ServiceOpenCl";

const categories = {
  "Bombas e Hidráulica": ["bomba", "pozo", "hidráulico", "presión", "agua", "sumergible"],
  "Eléctrico y Plantas": ["eléctrico", "motor", "generador", "planta"],
  "Piscinas e Impermeabilización": ["piscina", "impermeabilización", "fragua"],
  "Control y Automatización": ["tablero", "plc", "automatización", "variador"],
  "Limpieza y Desinfección": ["lavado", "tanques", "desinfección"],
  "Otros": [] // Servicios que no encajan en las anteriores
};

const groupServicesByCategory = (services) => {
  const grouped = {};
  for (const [cat, keywords] of Object.entries(categories)) {
    grouped[cat] = [];
  }

  services.forEach(service => {
    const nameDesc = (service.nombre + " " + service.descripcion).toLowerCase();
    let added = false;

    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(k => nameDesc.includes(k))) {
        grouped[cat].push(service);
        added = true;
        break;
      }
    }

    if (!added) grouped["Otros"].push(service);
  });

  return grouped;
};


const PrevArrow = ({ onClick, visible }) => {
  if (!visible) return null;
  return (
    <ArrowButtonLeft onClick={onClick}>
      <FaChevronLeft />
    </ArrowButtonLeft>
  );
};
const NextArrow = ({ onClick }) => (
  <ArrowButtonRight onClick={onClick}>
    <FaChevronRight />
  </ArrowButtonRight>
);

const SliderWrapper = styled.div`
  position: relative;

  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    background-color: #e3f2fd;
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: background-color 0.3s;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: #90caf9;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 20px;
    color: #1a237e;
    opacity: 1;
  }

  .slick-prev {
    left: -45px;
  }

  .slick-next {
    right: -45px;
  }
`;

// Estilos
const Container = styled.section`
  padding: 2rem 6rem;
  margin-bottom: 4rem;
`;

const ArrowButtonBase = styled.button`
  position: absolute;
  top: 40%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e3f2fd;
  color: #1a237e;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #90caf9;
  }

  svg {
    font-size: 1.25rem;
  }
`;

const ArrowButtonLeft = styled(ArrowButtonBase)`
  left: -50px;
`;

const ArrowButtonRight = styled(ArrowButtonBase)`
  right: -50px;
`;

const CategoryTitle = styled.h2`
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a237e;
`;

const Card = styled.div`
  padding: 1rem;
  margin-right: 1rem;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
  background: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-height: 200px; /* 👈 Asegura altura igual para todos */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1em; /* 👈 evita que se extienda demasiado (aprox. 2 líneas) */
`;

const IconWrapper = styled.div`
  background-color: #e6f0fb;
  color: #0077cc;
  width: 50px;
  height: 50px;
  margin: 0 auto 0.75rem auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ServiceName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
`;


const sliderSettings = (currentSlide, setCurrentSlide) => ({
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  centerMode: false,
  arrows: true,
  prevArrow: <PrevArrow visible={currentSlide > 0} />,
  nextArrow: <NextArrow />,
  afterChange: (index) => setCurrentSlide(index),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        centerMode: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        centerMode: false
      }
    }
  ]
});

const ServicesByCategoryCl = () => {
  const [groupedServices, setGroupedServices] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    handleGetServiceList()
      .then(res => {
        const grouped = groupServicesByCategory(res.data.data);
        setGroupedServices(grouped);
      })
      .catch(err => console.error("Error loading services", err));
  }, []);

  return (
    <Container>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1a237e" }}>
        Servicios por categoría
      </h1>

      {Object.entries(groupedServices).map(([category, services]) => (
        services.length > 0 && (
          <div key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <SliderWrapper>
              <Slider {...sliderSettings(currentSlide, setCurrentSlide)}>
                {services.map(service => (
                  <div key={service.id}>
                    <Card onClick={() => setSelectedService(service)}>
                      <IconWrapper>{getIconByService(service.nombre)}</IconWrapper>
                      <ServiceName>{service.nombre}</ServiceName>
                      <Description>
                        {service.descripcion.length > 60
                          ? service.descripcion.slice(0, 120) + "..."
                          : service.descripcion}
                      </Description>
                    </Card>
                  </div>
                ))}
              </Slider>
            </SliderWrapper>
          </div>
        )
      ))}
      {selectedService && (
        <ServiceOpenCl
          servicio={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </Container>

  );
};

export default ServicesByCategoryCl;
