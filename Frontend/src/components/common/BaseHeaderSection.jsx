import { FaPlus, FaSearch, FaFilter, FaTrash } from "react-icons/fa";
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
  flex-wrap: wrap; /* Por si en pantallas pequeñas los botones no caben */
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
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;

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
  min-width: 280px;

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
    min-width: 230px;
    padding: 5px 8px;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1976d2;
  }

  @media (max-width: 1280px) {
    font-size: 16px;
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

              <IconButton onClick={onFilter}>
                <FaFilter />
              </IconButton>

            </SearchContainer>
            <IconButton onClick={onDeleteSelected}>
              <FaTrash color="red" />
            </IconButton>
        </OptionsContainer>
      </Card>
    </>
  );
};

export default BaseHeaderSection;
