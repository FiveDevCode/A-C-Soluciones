import styled from "styled-components";
import { handleGetServiceList } from "../../controllers/client/getServiceListCl.controller";
import { useEffect, useState } from "react";
import ServiceOpenCl from "../../components/client/ServiceOpenCl";
import getIconByService from "../../components/client/GetIconServiceCl";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TextField, Box, FormGroup, FormControlLabel, Checkbox, Typography, InputAdornment, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MenuSideCl from "../../components/client/MenuSideCl";
import HeaderBarCl from "../../components/client/HeaderBarCl";

const PageContainer = styled.div`
  margin-left: 220px;
  margin-top: 145px;
  min-height: calc(100vh - 145px);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1280px) {
    margin-left: 180px;
  }
`;

const ContainerServices = styled.section`
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchSection = styled(Box)`
  display: flex;
  justify-content: start;
  margin: 1.5rem 0;
`;

const Layout = styled.div`
  display: flex;
  gap: 2rem;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 165px; /* 145px del header + 20px de margen */

  @media screen and (max-width: 1024px) {
    width: 100%;
    position: static;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0; /* Importante para flex overflow */
`;

const ContentServices = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding-bottom: 3rem;

  @media screen and (max-width: 1520px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Service = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  min-height: 220px;
  background-color: #fff;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    border-color: #91cdffff;
  }

  & > :first-child {
    margin-bottom: 0.75rem;
  }
`;

const TitleService = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0.5rem 0;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #91cdffff 0%, #60a5fa 100%);
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(145, 205, 255, 0.4);

  svg {
    width: 32px;
    height: 32px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 1rem;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  && {
    margin-left: 0;
    margin-right: 0;
    
    .MuiFormControlLabel-label {
      font-size: 0.9rem;
      color: #475569;
    }

    .MuiCheckbox-root {
      color: #94a3b8;
      
      &.Mui-checked {
        color: #91cdffff;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.95rem;
  }
`;

const ServicesAllPageCl = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setCurrentPage(1);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <MenuSideCl />
      <HeaderBarCl />
      <PageContainer>
        <ContainerServices>
          <TitleSection>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", md: "1.925rem" },
                color: "#1a237e",
                marginBottom: "0.5rem",
              }}
            >
              Elige el servicio que necesitas
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "#64748b",
              }}
            >
              Explora nuestra amplia gama de servicios profesionales
            </Typography>
          </TitleSection>

          <SearchSection>
            <TextField
              variant="outlined"
              placeholder="Buscar servicios..."
              size="small"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                width: { xs: '100%', md: '50%' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  '&:hover fieldset': {
                    borderColor: '#91cdffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#91cdffff',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />
          </SearchSection>

          <Layout>
            <Sidebar>
              <FilterSection>
                <FilterTitle variant="h6">Filtrar por categoría</FilterTitle>
                <Divider sx={{ mb: 2 }} />
                <FormGroup>
                  {availableTags.map((tag) => (
                    <StyledFormControlLabel
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
              </FilterSection>
              
              {selectedTags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: '#64748b',
                      mb: 0.5
                    }}
                  >
                    Filtros activos: {selectedTags.length}
                  </Typography>
                  <Typography
                    component="span"
                    onClick={() => setSelectedTags([])}
                    sx={{
                      fontSize: '0.85rem',
                      color: '#91cdffff',
                      cursor: 'pointer',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Limpiar filtros
                  </Typography>
                </Box>
              )}
            </Sidebar>

            <MainContent>
              {loading ? (
                <EmptyState>
                  <h3>Cargando servicios...</h3>
                </EmptyState>
              ) : currentServices.length === 0 ? (
                <EmptyState>
                  <h3>No se encontraron servicios</h3>
                  <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
                </EmptyState>
              ) : (
                <>
                  <ContentServices>
                    {currentServices.map((service) => (
                      <Service key={service.id} onClick={() => setSelectedService(service)}>
                        <IconWrapper>{getIconByService(service.nombre)}</IconWrapper>
                        <TitleService>{service.nombre}</TitleService>
                        <Description>
                          {service.descripcion.length > 80
                            ? service.descripcion.slice(0, 80) + "..."
                            : service.descripcion}
                        </Description>
                      </Service>
                    ))}
                  </ContentServices>

                  {totalPages > 1 && (
                    <Stack spacing={2} sx={{ mt: 4, mb: 3, alignItems: "center" }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            '&.Mui-selected': {
                              backgroundColor: '#91cdffff',
                              '&:hover': {
                                backgroundColor: '#60a5fa',
                              },
                            },
                          },
                        }}
                      />
                    </Stack>
                  )}
                </>
              )}
            </MainContent>
          </Layout>
        </ContainerServices>

        {selectedService && (
          <ServiceOpenCl
            servicio={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </PageContainer>
    </>
  );
};

export default ServicesAllPageCl;