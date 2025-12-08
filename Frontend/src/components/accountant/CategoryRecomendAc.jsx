import React from 'react';
import { 
  faFileInvoiceDollar, 
  faCreditCardAlt, 
  faChartLine, 
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ContainerCategory = styled.section`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 10px;
  padding: 1rem;
  gap: 1rem;
`;

const ContainerOption = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Option = styled(Link)`
  display: flex;
  gap: 1rem;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 5px;
  align-items: center;
  padding: 0 1rem;
  width: calc((100% - 3rem) / 4);
  height: 60px;

  &:hover {
    background: linear-gradient(90deg, #e4d9ff 0%, #f5f5ff 100%);
    cursor: pointer;

    h2 {
      font-weight: bold;
    }

    svg {
      color: #000000;
      stroke-width: 0;
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #FFFFFF;
  font-size: 1.5rem;  
  stroke-width: 2rem;
`;

const OptionTitle = styled.h2`
  font-size: 1rem;
  font-weight: normal;
`;

export const CategoryRecomendAc = () => {
  return (
    <ContainerCategory>
      <h1>Categorías recomendadas</h1>
      <ContainerOption>
        <Option to="/contador/facturas">
          <Icon icon={faFileInvoiceDollar} style={{ stroke: "#1ac762" }} />
          <OptionTitle>Gestionar facturas</OptionTitle>
        </Option>

        <Option to="/contador/cuentas">
          <Icon icon={faCreditCardAlt} style={{ stroke: "#007BFF" }} />
          <OptionTitle>Gestionar cuentas de pago</OptionTitle>
        </Option>

        <Option to="/contador/reportes">
          <Icon icon={faChartLine} style={{ stroke: "#6F42C1" }} />
          <OptionTitle>Ver reportes contables</OptionTitle>
        </Option>

      </ContainerOption>
    </ContainerCategory>
  );
};
