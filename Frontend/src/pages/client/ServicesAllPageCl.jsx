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
import { useMenu } from "../../components/client/MenuContext";

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const WelcomeSection = styled.header`
  background-color: #007BFF;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1350px) {
    padding: 1.2rem;
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;

const ContainerServices = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2.5rem;
  padding-top: 1.75rem;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media screen and (max-width: 1520px) {
    padding: 1.25rem 2rem;
    padding-top: 1.5rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1rem 1.5rem;
    padding-top: 1.25rem;
    max-height: none;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 1rem;
`;

const SearchSection = styled(Box)`
  display: flex;
  justify-content: start;
  margin: 1rem 0;
`;

const Layout = styled.div`
  display: flex;
  gap: 1.5rem;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 220px;
  flex-shrink: 0;
  background-color: #fff;
  padding: 1.25rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  @media screen and (max-width: 1024px) {
    width: 100%;
    position: static;
    max-height: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0; /* Importante para flex overflow */
`;

const ContentServices = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  padding-bottom: 1.5rem;

  @media screen and (max-width: 1520px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Service = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 1.25rem 0.875rem;
  cursor: pointer;
  min-height: 180px;
  background-color: #fff;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 16px rgba(0, 123, 255, 0.15);
    border-color: #007BFF;
  }

  & > :first-child {
    margin-bottom: 0.5rem;
  }
`;

const TitleService = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0.25rem 0;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  color: #64748b;
  text-align: center;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);

  svg {
    width: 26px;
    height: 26px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 0.75rem;
`;

const FilterTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  && {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0.25rem;
    
    .MuiFormControlLabel-label {
      font-size: 0.85rem;
      color: #475569;
    }

    .MuiCheckbox-root {
      color: #94a3b8;
      padding: 0.4rem;
      
      &.Mui-checked {
        color: #007BFF;
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
  const { collapsed } = useMenu();
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

  const servicesPerPage = 9;
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
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          SERVICIOS
        </WelcomeSection>
        <ContainerServices>
          <TitleSection>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.35rem", md: "1.65rem" },
                color: "#1e293b",
                marginBottom: "0.4rem",
              }}
            >
              Elige el servicio que necesitas
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
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
                <Divider sx={{ mb: 1.5, mt: 0.5 }} />
                <FormGroup>
                  {availableTags.map((tag) => (
                    <StyledFormControlLabel
                      key={tag}
                      control={
                        <Checkbox
                          checked={selectedTags.includes(tag)}
                          onChange={() => handleTagToggle(tag)}
                          size="small"
                        />
                      }
                      label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                    />
                  ))}
                </FormGroup>
              </FilterSection>
              
              {selectedTags.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: '#64748b',
                      mb: 0.4,
                      fontSize: '0.8rem'
                    }}
                  >
                    Filtros activos: {selectedTags.length}
                  </Typography>
                  <Typography
                    component="span"
                    onClick={() => setSelectedTags([])}
                    sx={{
                      fontSize: '0.8rem',
                      color: '#007BFF',
                      cursor: 'pointer',
                      fontWeight: 600,
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
                    <Stack spacing={1} sx={{ mt: 2, mb: 1.5, alignItems: "center" }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                        shape="rounded"
                        size="medium"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            '&.Mui-selected': {
                              backgroundColor: '#007BFF',
                              '&:hover': {
                                backgroundColor: '#0056b3',
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