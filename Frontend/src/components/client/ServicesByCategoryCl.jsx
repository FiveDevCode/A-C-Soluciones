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
  "Bombas e Hidráulica": ["bomba", "pozo", "hidráulico", "presión", "agua", "sumergible", "excavacion", "excavación"],
  "Eléctrico y Plantas": ["eléctrico", "motor", "generador", "planta", "emergencia"],
  "Piscinas e Impermeabilización": ["piscina", "impermeabilización", "fragua", "terrazas"],
  "Control y Automatización": ["tablero", "plc", "automatización", "variador", "arrancador", "transferencia"],
  "Instalaciones Eléctricas e Iluminación": ["iluminación", "iluminacion", "instalacion", "instalación"],
  "Limpieza y Desinfección": ["lavado", "tanques", "desinfección", "desinfeccion", "cañerias", "cañerías"],
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
  padding: 0 3rem;
  margin: 0 auto;

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
    z-index: 1;
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
    left: -50px;
  }

  .slick-next {
    right: -50px;
  }

  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
    
    .slick-prev {
      left: -35px;
    }

    .slick-next {
      right: -35px;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 0 1rem;
    
    .slick-prev {
      left: -25px;
    }

    .slick-next {
      right: -25px;
    }
  }
`;

// Estilos
const Container = styled.section`
  padding: 2rem 6rem;
  margin-bottom: 4rem;
  max-width: 100%;
  
  @media screen and (max-width: 1280px) {
    padding: 2rem 4rem;
  }
  
  @media screen and (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
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

const CategorySection = styled.div`
  margin-bottom: 3.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a237e;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

const Card = styled.div`
  padding: 1.25rem;
  margin-right: 1rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.08);
  background: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 220px;
  max-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0,0,0,0.15);
  }
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  margin-top: 0.5rem;
  text-align: center;
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
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0.5rem 0;
  line-height: 1.3;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;



const ServicesByCategoryCl = () => {
  const [groupedServices, setGroupedServices] = useState({});
  const [currentSlides, setCurrentSlides] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    handleGetServiceList()
      .then(res => {
        const grouped = groupServicesByCategory(res.data.data);
        setGroupedServices(grouped);
        // Inicializar el estado de slides para cada categoría
        const initialSlides = {};
        Object.keys(grouped).forEach(cat => {
          initialSlides[cat] = 0;
        });
        setCurrentSlides(initialSlides);
      })
      .catch(err => console.error("Error loading services", err));
  }, []);

  const handleSlideChange = (category, index) => {
    setCurrentSlides(prev => ({
      ...prev,
      [category]: index
    }));
  };

  const getSliderSettingsForCategory = (category, servicesLength) => {
    const currentSlide = currentSlides[category] || 0;
    const slidesToShow = Math.min(4, servicesLength);
    
    return {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: slidesToShow,
      slidesToScroll: slidesToShow,
      initialSlide: 0,
      centerMode: false,
      arrows: true,
      prevArrow: <PrevArrow visible={currentSlide > 0} />,
      nextArrow: <NextArrow />,
      afterChange: (index) => handleSlideChange(category, index),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(2, servicesLength),
            slidesToScroll: Math.min(2, servicesLength),
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
    };
  };

  // Orden de categorías para mostrar
  const categoryOrder = [
    "Bombas e Hidráulica",
    "Eléctrico y Plantas",
    "Piscinas e Impermeabilización",
    "Control y Automatización",
    "Instalaciones Eléctricas e Iluminación",
    "Limpieza y Desinfección",
    "Otros"
  ];

  return (
    <Container>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1a237e", marginBottom: "2rem" }}>
        Servicios por categoría
      </h1>

      {categoryOrder.map(category => {
        const services = groupedServices[category] || [];
        if (services.length === 0) return null;

        return (
          <CategorySection key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <SliderWrapper>
              <Slider {...getSliderSettingsForCategory(category, services.length)}>
                {services.map(service => (
                  <div key={service.id}>
                    <Card onClick={() => setSelectedService(service)}>
                      <IconWrapper>{getIconByService(service.nombre)}</IconWrapper>
                      <ServiceName>{service.nombre}</ServiceName>
                      <Description>
                        {service.descripcion && service.descripcion.length > 60
                          ? service.descripcion.slice(0, 120) + "..."
                          : service.descripcion || ""}
                      </Description>
                    </Card>
                  </div>
                ))}
              </Slider>
            </SliderWrapper>
          </CategorySection>
        );
      })}
      
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
