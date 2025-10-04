import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Checkbox, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { handleGetListFaqs } from '../../controllers/common/getListFaqs.controller';
import HeaderBarHome from '../../components/common/HeaderBarHome';
import FooterHome from '../../components/common/FooterHome';

const ContainerAll = styled.section`
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  display: flex;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background: white;
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem 8rem;
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

// ...
const defaultCategories = [
  'Monitoreo en tiempo real',
  'Instalación y configuración',
  'Mantenimiento y soporte técnico',
  'Facturación y pagos',
  'Seguridad y privacidad',
  'Cuenta y acceso',
  'Sensores y equipamiento'
];

const ClientFaqsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [allFaqs, setAllFaqs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await handleGetListFaqs();
        const data = response.data.data;
        setFaqs(data);
        setAllFaqs(data);
      } catch (error) {
        console.error("Error al obtener las FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const handleCheckboxChange = (value) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  useEffect(() => {
    const filtered = allFaqs.filter((faq) => {
      return selectedCategories.length === 0 || selectedCategories.includes(faq.categoria);
    });

    setFaqs(filtered);
  }, [selectedCategories, allFaqs]);

  const fetchedCategories = allFaqs.map(faq => faq.categoria).filter(Boolean);
  const uniqueCategories = [...new Set([...defaultCategories, ...fetchedCategories])];

  return (
    <ContainerAll>
      {userRole !== "cliente" && <HeaderBarHome />}
      <Container>
        <FiltroContainer>
          <TituloFiltro>
            <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem' }} />
            Filtros
          </TituloFiltro>

          <Seccion>
            <CategoriaTitulo>Categoría</CategoriaTitulo>
            {uniqueCategories.map((cat) => (
              <CheckboxLabel key={cat}>
                <Checkbox
                  size="small"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCheckboxChange(cat)}
                />
                {cat}
              </CheckboxLabel>
            ))}
          </Seccion>
        </FiltroContainer>

        <Contenido>
          <Typography variant="h6" align="center" gutterBottom style={{ color: "black" }}>
            Preguntas frecuentes
          </Typography>

          {faqs.length === 0 ? (
            <Typography variant="body1" style={{ color: 'gray', textAlign: 'center' }}>
              No hay resultados para los filtros seleccionados.
            </Typography>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id}>
                <Pregunta>{faq.pregunta}</Pregunta>
                <Respuesta>{faq.respuesta}</Respuesta>
              </div>
            ))
          )}
        </Contenido>
      </Container>
      {userRole !== "cliente" && <FooterHome />}
    </ContainerAll>
  );
};


export default ClientFaqsPage;
