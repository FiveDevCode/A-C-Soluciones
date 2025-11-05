import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@mui/material";

const Container = styled.div`
  display: flex;
  font-family:  sans-serif;
  background:white;
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 20px;
  border-right: 1px solid #ccc;
  color:black;
`;

const SectionTitle = styled.h4`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #000;
  margin-bottom: 10px;
  padding: 15px 90px;
  background-color: #f5f5f5;
  color:black;
  width:100%;
  
`;

const CardText = styled.div`
  font-size: 14px;
  line-height: 1.4;

  strong {
    display: block;
  }
`;

const CardIcons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ClientNotificationCl = () => {
  const categories = {
    "Tipo de acción": [
      "Solicitudes enviadas",
      "Revisión técnica agendada",
      "Notificaciones leídas",
      "Cambios de datos personales",
      "Registros de mantenimiento",
    ],
    Estado: ["Completado", "Pendiente", "En proceso", "Cancelado"],
    "Tipo Sistema": ["Turbinas", "Generadores", "Compuertas", "Sensores"],
  };

  const cards = Array(6).fill({
    title: "Solicitud de revisión enviada",
    subtitle: "Planta \"Andenes del Sur\" — Revisión de compuerta hidráulica",
    date: "08/04/2025",
  });

  return (
    <Container>
      <Sidebar>
        <FilterLabel>
          <FontAwesomeIcon icon={faFilter} style={{ marginRight: "8px" }} />
          Filtros
        </FilterLabel>
        {Object.entries(categories).map(([title, options]) => (
          <div key={title}>
            <SectionTitle>{title}</SectionTitle>
            {options.map((opt) => (
              <FilterLabel key={opt}>
                <Checkbox size="small" /> {opt}
              </FilterLabel>
            ))}
          </div>
        ))}
      </Sidebar>

      <Content>
        <Title style={{color:"black"}}>Tu historial</Title>
        {cards.map((card, index) => (
          <Card key={index}>
            <CardText>
              {card.title}
              <strong>{card.subtitle}</strong>
              {card.date}
            </CardText>
            <CardIcons>
              <FontAwesomeIcon icon={faTrash} />
              <FontAwesomeIcon icon={faArrowRight} />
            </CardIcons>
          </Card>
        ))}
      </Content>
    </Container>
  );
};

export default ClientNotificationCl;