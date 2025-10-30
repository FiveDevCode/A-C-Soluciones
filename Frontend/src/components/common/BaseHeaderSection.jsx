import React from "react";
import styled from "styled-components";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";

/* ---------------------- 🔹 Estilos base ---------------------- */



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

const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;

  @media (max-width: 1280px) {
    margin: 20px 10px 0 10px;
    padding: 15px;
    width: 95%;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
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
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
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

const FilterButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;

  @media (max-width: 1280px) {
    font-size: 16px;
  }
`;

/* ---------------------- 🔹 Componente base ---------------------- */

const BaseHeaderSection = ({
  headerTitle = "GESTIÓN GENERAL",
  sectionTitle = "Listado de registros",
  addLabel = "Agregar",
  placeholder = "Buscar...",
  onAdd,
  onFilter,
  onSearchChange,
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

        <SearchContainer>
          <SearchBox>
            <FaSearch color="#555" />
            <input
              type="text"
              placeholder={placeholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </SearchBox>

          <FilterButton onClick={onFilter}>
            <FaFilter />
          </FilterButton>
        </SearchContainer>
      </Card>
    </>
  );
};

export default BaseHeaderSection;
