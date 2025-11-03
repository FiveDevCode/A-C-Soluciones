import { FaPlus, FaSearch } from "react-icons/fa";
import styled from "styled-components";

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 1280px) {
    padding: 1.2rem;
    font-size: 18px;
  }
`;

const TitleSection = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: left;

  @media (max-width: 1280px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const ContainerAdd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1280px) {
    width: 95%;
    padding: 15px;
    margin-top: 25px;
    border-radius: 6px 6px 0 0;
    margin: 40px 0 0 0;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 1280px) {
    gap: 8px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1280px) {
    gap: 6px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f1f3f4;
  padding: 6px 10px;
  border-radius: 6px;
  flex: 1;
  width: 270px;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    margin-left: 6px;
  }

  @media (max-width: 1280px) {
    padding: 5px 8px;
    width: 250px;
    input {
      font-size: 13px;
    }
  }
`;

const Select = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  background: white;
  transition: all 0.2s;

  &:focus {
    border-color: #1976d2;
    outline: none;
  }

  @media (max-width: 1280px) {
    font-size: 13px;
    padding: 5px 8px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1280px) {
    gap: 6px;
  }
`;

const Button = styled.button`
  background-color: ${({ active }) => (active ? "#ffcdd2" : "#c0c0c0")};
  color: ${({ active }) => (active ? "#b71c1c" : "white")};
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  font-weight: bold;

  &:hover {
    background-color: ${({ active }) => (active ? "#ef9a9a" : "#b0b0b0")};
  }

  @media (max-width: 1280px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;

const AddButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;

  &:hover {
    background-color: #1565c0;
  }

  @media (max-width: 1280px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;

const BaseHeaderSection = ({
  headerTitle = "GESTIÓN GENERAL",
  sectionTitle = "Listado de registros",
  addLabel = "Agregar",
  placeholder = "Buscar...",
  onAdd,
  onSearchChange,
  onFilterChange,
  filters = [],
  onClearFilters,
  onDeleteSelected,
  selectedCount = 0,
}) => {
  return (
    <>
      <Header>{headerTitle}</Header>

      <Card>
        <ContainerAdd>
          <TitleSection>
            {sectionTitle}
          </TitleSection>
          <AddButton onClick={onAdd}>
            <FaPlus /> {addLabel}
          </AddButton>
        </ContainerAdd>

        <OptionsContainer>
          <SearchContainer>
            <SearchBox>
              <FaSearch color="#555" />
              <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </SearchBox>

            {filters.map((filter) => (
              <Select
                key={filter.key}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
              >
                <option value="">-{filter.label.toLowerCase()}-</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            ))}
          </SearchContainer>

          <ButtonsContainer>
            <Button onClick={onClearFilters}>Limpiar filtros</Button>
            <Button
              active={selectedCount > 0}
              disabled={selectedCount === 0}
              onClick={onDeleteSelected}
            >
              Eliminar seleccionadas
            </Button>
          </ButtonsContainer>
        </OptionsContainer>
      </Card>
    </>
  );
};

export default BaseHeaderSection;
