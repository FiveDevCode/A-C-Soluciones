import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const FiltersContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 1280px) {
    gap: 10px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f1f3f4;
  padding: 8px 12px;
  border-radius: 6px;
  flex: 1;
  max-width: 280px;
  transition: all 0.2s ease;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    margin-left: 6px;
  }

  @media (max-width: 1280px) {
    max-width: 100%;
    padding: 6px 10px;

    input {
      font-size: 13px;
    }
  }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    border-color: #1976d2;
    outline: none;
  }

  @media (max-width: 1280px) {
    font-size: 13px;
    padding: 6px 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1280px) {
    gap: 8px;
  }
`;

const Button = styled.button`
  background-color: ${({ type }) =>
    type === "clear" ? "#c0c0c0" : type === "delete" ? "#b71c1c" : "#1976d2"};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background-color: ${({ type }) =>
      type === "clear"
        ? "#b0b0b0"
        : type === "delete"
        ? "#d32f2f"
        : "#1565c0"};
  }

  &:disabled {
    background-color: #ddd;
    color: #888;
    cursor: not-allowed;
  }

  @media (max-width: 1280px) {
    font-size: 13px;
    padding: 6px 10px;
  }
`;

const BaseFilters = ({
  placeholder = "Buscar...",
  filters = [],
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <FiltersContainer>
      {/* 🔍 Campo de búsqueda */}
      <SearchBox>
        <FaSearch color="#555" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </SearchBox>

      {/* 🧩 Filtros dinámicos */}
      {filters.map((filter) => (
        <Select
          key={filter.key}
          onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
        >
          <option value="">Todos los {filter.label.toLowerCase()}</option>
          {filter.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      ))}

      {/* ⚙️ Botones */}
      <ButtonGroup>
        <Button type="clear" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </ButtonGroup>
    </FiltersContainer>
  );
};

export default BaseFilters;