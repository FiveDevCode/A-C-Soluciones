import React from "react";
import styled from "styled-components";
import { FaPlus, FaSearch, FaFilter, FaTrash } from "react-icons/fa";

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 16px;
  color: #1565c0;
  margin-bottom: 10px;
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
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;
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

          <IconButton onClick={onDeleteSelected}>
            <FaTrash color="red" />
          </IconButton>
        </SearchContainer>
      </Card>
    </>
  );
};

export default BaseHeaderSection;
