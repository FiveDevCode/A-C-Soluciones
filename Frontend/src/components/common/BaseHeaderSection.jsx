import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import styled from "styled-components";

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 1280px) {
    padding: 1rem;
    font-size: 18px;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

const RightButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1280px) {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
  }
`;


const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;
  border-radius: 8px 8px 0 0;

  @media (max-width: 1280px) {
    margin: 20px 10px 0 10px;
    padding: 15px;
    width: 95%;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 16px;
  color: #1565c0;
  margin-bottom: 10px;

  @media (max-width: 1280px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const AddButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  transition: background 0.3s;

  &:hover {
    background-color: #1565c0;
  }

  @media (max-width: 1280px) {
    padding: 6px 10px;
    font-size: 12px;
    gap: 4px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  flex: 1;

  @media (max-width: 1280px) {
    flex-wrap: wrap;
    justify-content: space-between;
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
  max-width: 280px;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    margin-left: 6px;

    @media (max-width: 1280px) {
      font-size: 12px;
    }
  }

  @media (max-width: 1280px) {
    max-width: 230px;
    padding: 5px 8px;
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
    background-color: ${({ active }) => (active ? "#ef9a9a" : "#a0a0a0")};
  }

  @media (max-width: 1280px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const BaseHeaderSection = ({
  headerTitle = "GESTIÓN GENERAL",
  sectionTitle = "Listado de registros",
  addLabel = "Agregar",
  placeholder = "Buscar...",
  onAdd,
  onFilter,
  onSearchChange,
  onDeleteSelected,
  onClearFilters,
  selectedCount = 0, // 👈 cantidad seleccionada
}) => {
  return (
    <>
      <Header>{headerTitle}</Header>

      <Card>
        <Menu>
          <Title>{sectionTitle}</Title>
          <AddButton onClick={onAdd}>
            <FaPlus /> {addLabel}
          </AddButton>
        </Menu>

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
        </SearchContainer>

        <RightButtons>
          <Button onClick={onClearFilters}>Limpiar filtros</Button>
          <Button
            active={selectedCount > 0}
            disabled={selectedCount === 0}
            onClick={onDeleteSelected}
          >
            Eliminar facturas seleccionadas
          </Button>
        </RightButtons>
      </OptionsContainer>
      </Card>
    </>
  );
};

export default BaseHeaderSection;
