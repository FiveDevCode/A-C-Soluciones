


import React from 'react';
import styled from 'styled-components';
import { Checkbox, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background:white;
`;

const FiltroContainer = styled.div`
  width: 300px;
  margin-right: 2rem;
`;

const TituloFiltro = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 1rem;
  color: black;
`;

const Seccion = styled.div`
  margin-bottom: 2rem;
  color: black;
`;

const CategoriaTitulo = styled.p`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin: 0.3rem 0;
`;

const Contenido = styled.div`
  flex: 1;
`;

const Pregunta = styled.div`
  background-color: #7b2cbf;
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-weight: bold;
`;

const Respuesta = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0 1.5rem 0;
  color: black;
`;

const ClientFaqsCl = () => {
  return (
    <Container>
      <FiltroContainer>
        <TituloFiltro>
          <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem' }} />
          Filtros
        </TituloFiltro>

        <Seccion>
          <CategoriaTitulo>Categoría</CategoriaTitulo>
          {['Monitoreo en tiempo real', 'Instalación y configuración', 'Mantenimiento y soporte técnico', 'Facturación y pagos', 'Seguridad y privacidad', 'Cuenta y acceso', 'Sensores y equipamiento'].map((cat) => (
            <CheckboxLabel key={cat}>
              <Checkbox size="small" /> {cat}
            </CheckboxLabel>
          ))}
        </Seccion>

        <Seccion>
          <CategoriaTitulo>Departamento</CategoriaTitulo>
          {['Operaciones', 'Mantenimiento', 'Administración', 'Atención al cliente'].map((dep) => (
            <CheckboxLabel key={dep}>
              <Checkbox size="small" /> {dep}
            </CheckboxLabel>
          ))}
        </Seccion>

        <Seccion>
          <CategoriaTitulo>Tipo Servicio</CategoriaTitulo>
          {['Servicio de monitoreo inteligente', 'Diagnóstico energético'].map((serv) => (
            <CheckboxLabel key={serv}>
              <Checkbox size="small" /> {serv}
            </CheckboxLabel>
          ))}
        </Seccion>
      </FiltroContainer>

      <Contenido>
        <Typography variant="h6" align="center" gutterBottom style={{color:"black"}}> 
          Preguntas frecuentes
        </Typography>

        {[...Array(6)].map((_, idx) => (
          <div key={idx}>
            <Pregunta>¿Qué métodos de pago existen?</Pregunta>
            <Respuesta>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </Respuesta>
          </div>
        ))}
      </Contenido>
    </Container>
  );
};

export default ClientFaqsCl;