import styled from "styled-components";
import { handleGetServiceList } from "../../controllers/client/getServiceListCl.controller";
import { useEffect, useState } from "react";
import ServiceOpenCl from "../../components/client/ServiceOpenCl";
import getIconByService from "../../components/client/GetIconServiceCl";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TextField, Box, FormGroup, FormControlLabel, Checkbox, Typography, InputAdornment, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const ContainerServices = styled.section`
  display: flex;
  flex-direction: column;
`;

const Layout = styled.div`
  display: flex;
  padding: 0 8rem;
  gap: 2rem;
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
`;

const ContentServices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding-bottom: 5rem;
  padding-top: 2rem;
`;

const Service = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: calc((100% - 3 * 1.25rem) / 3);
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  min-height: 200px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  }

  & > :first-child {
    margin-bottom: 0.5rem;
  }
`;

const TitleService = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #505050;
`;

const Description = styled.h3`
  font-size: 1rem;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f0fb;
  color: #0077cc;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto 0.75rem auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  svg {
    width: 28px;
    height: 28px;
  }
`;

const ServicesAllPageCl = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const availableTags = [
    "eléctrico",
    "hidráulico",
    "pozos",
    "control",
    "impermeabilización",
    "limpieza",
    "iluminación",
    "piscinas"
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reiniciar paginación
  };

  const servicesPerPage = 6;
  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;

  const filteredServices = services.filter(service => {
    const matchesText =
      service.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      service.descripcion.toLowerCase().includes(filterText.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag =>
        service.nombre.toLowerCase().includes(tag) ||
        service.descripcion.toLowerCase().includes(tag)
      );

    return matchesText && matchesTags;
  });

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const currentServices = filteredServices.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    handleGetServiceList()
      .then((response) => {
        setServices(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  return (
    <ContainerServices>
      <Typography 
        component="h1" 
        sx={{ 
          fontWeight: 700, 
          fontSize: "1.925rem",
          padding: "1rem 8rem 0.5rem", 
          color: "#1a237e",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mb: 0.5
        }}
      >
        Elige el servicio que necesitas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3, mb: 2, ml: "8rem" }}>
        <TextField
          variant="outlined"
          size="small"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ width: '50%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Layout>
        <Sidebar>
          <Typography variant="h6" gutterBottom>Filtrar por categoría</Typography>
          <Divider />
          <FormGroup>
            {availableTags.map((tag) => (
              <FormControlLabel
                key={tag}
                control={
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                }
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
              />
            ))}
          </FormGroup>
        </Sidebar>

        <MainContent>
          <ContentServices>
            {currentServices.map((service) => (
              <Service key={service.id} onClick={() => setSelectedService(service)}>
                <IconWrapper>{getIconByService(service.nombre)}</IconWrapper>
                <TitleService>{service.nombre}</TitleService>
                <Description title={service.descripcion}>
                  {service.descripcion.length > 30
                    ? service.descripcion.slice(0, 60) + "..."
                    : service.descripcion}
                </Description>
              </Service>
            ))}
          </ContentServices>

          <Stack spacing={2} sx={{ mt: 2, mb: 5, alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              size="large"
            />
          </Stack>
        </MainContent>
      </Layout>

      {selectedService && (
        <ServiceOpenCl
          servicio={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </ContainerServices>
  );
};

export default ServicesAllPageCl;
