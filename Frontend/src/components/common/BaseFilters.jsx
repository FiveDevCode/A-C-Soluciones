import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const FiltersContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 1350px) {
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
  width: 260px;
  transition: all 0.2s ease;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 240px;
    font-size: 14px;
    margin-left: 6px;
  }

  @media (max-width: 1350px) {
    max-width: 240px;
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

  @media (max-width: 1350px) {
    font-size: 13px;
    padding: 6px 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1350px) {
    gap: 8px;
  }
`;

const Button = styled.button`
  background-color: ${({ type }) =>
    type === "clear" ? "#c0c0c0" : "#1976d2"};
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
      type === "clear" ? "#b0b0b0" : "#1565c0"};
  }

  @media (max-width: 1350px) {
    font-size: 13px;
    padding: 6px 10px;
  }
`;

const BaseFilters = ({
  data = [],
  placeholder = "Buscar...",
  filterOptions = [],
  searchKeys = [],
  onFilteredChange,
}) => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const filteredData = data.filter((item) => {
    const text = searchTerm.toLowerCase();

    const matchesSearch =
      searchKeys.length === 0
        ? true
        : searchKeys.some((key) =>
            item[key]?.toString().toLowerCase().includes(text)
          );

    const matchesFilters = filterOptions.every((filter) => {
      const filterKey = filter.key;
      const filterValue = filters[filterKey];
      if (!filterValue) return true;

      const itemValue = item[filterKey]?.toString().toLowerCase();
      return itemValue === filterValue.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  useEffect(() => {
    onFilteredChange?.(filteredData);
  }, [filters, searchTerm, data]);

  return (
    <FiltersContainer>
      <SearchBox>
        <FaSearch color="#555" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBox>


      {filterOptions.map((filter) => (
        <Select
          key={filter.key}
          value={filters[filter.key] || ""}
          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
        >
          <option value="">-{filter.label}-</option>
          {filter.options.map((opt, i) => {
            if (typeof opt === "object") {
              return (
                <option key={opt.value || i} value={opt.value}>
                  {opt.label || opt.value}
                </option>
              );
            }
            return (
              <option key={opt || i} value={opt}>
                {opt}
              </option>
            );
          })}
        </Select>
      ))}

      <ButtonGroup>
        <Button type="clear" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      </ButtonGroup>
    </FiltersContainer>
  );
};

export default BaseFilters;
