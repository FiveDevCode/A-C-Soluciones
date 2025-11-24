import { 
  faBriefcase,
  faCalendarAlt,
  faCalendarCheck, 
  faCheckCircle, 
  faClipboardList, 
  faFileAlt, 
  faInbox,
  faPlayCircle,
  faTimesCircle,
  faTruck, 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ContainerCategory = styled.section`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a237e;
  margin: 0;
  letter-spacing: -0.02em;
`;

const ContainerOption = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  transition: transform 0.3s ease;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.75rem;
  color: #1a237e;
`;

const OptionTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  transition: all 0.3s ease;
`;

const Option = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  background: #ffffff;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 120px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #91cdffff 0%, #60a5fa 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #91cdffff;
    cursor: pointer;

    &::before {
      transform: scaleX(1);
    }

    ${OptionTitle} {
      color: #1a237e;
      font-weight: 600;
    }

    ${IconWrapper} {
      transform: scale(1.1);
    }
  }
`;


const CategoryRecomendTc = () => {
  const categories = [
    { 
      to: "/tecnico/visitas", 
      icon: faClipboardList, 
      title: "Visitas",
      color: "#17A2B8"
    },
    { 
      to: "/tecnico/visitas-programadas", 
      icon: faCalendarAlt, 
      title: "Visitas programadas",
      color: "#4a8838"
    },
    { 
      to: "/tecnico/visitas-en-camino", 
      icon: faTruck, 
      title: "Visitas en camino",
      color: "#a72063"
    },
    { 
      to: "/tecnico/visitas-iniciadas", 
      icon: faPlayCircle, 
      title: "Visitas iniciadas",
      color: "#3151aa"
    },
    { 
      to: "/tecnico/visitas-completadas", 
      icon: faCheckCircle, 
      title: "Visitas completadas",
      color: "#21da21"
    },
    { 
      to: "/tecnico/visitas-canceladas", 
      icon: faTimesCircle, 
      title: "Visitas canceladas",
      color: "#b8103a"
    }
  ];

  return (
    <ContainerCategory>
      <Title>Categorías recomendadas</Title>
      <ContainerOption>
        {categories.map((category, index) => (
          <Option key={index} to={category.to}>
            <IconWrapper>
              <Icon icon={category.icon} style={{ color: category.color }} />
            </IconWrapper>
            <OptionTitle>{category.title}</OptionTitle>
          </Option>
        ))}
      </ContainerOption>
    </ContainerCategory>
  );
};


export default CategoryRecomendTc;
