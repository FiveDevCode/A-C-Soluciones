import { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const FiltersContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 1350px) {
    gap: 12px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f1f3f4;
  padding: 8px 12px;
  border-radius: 6px;
  flex: 2;
  min-width: 320px;
  transition: all 0.2s ease;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    min-width: 0;
    font-size: 14px;
    margin-left: 6px;

    &::placeholder {
      overflow: visible;
      white-space: nowrap;
    }
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    min-width: 200px;
    flex: 1.5;
    padding: 6px 10px;

    input {
      font-size: 12px;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 768px) {
    min-width: 100%;
    flex-basis: 100%;
    padding: 10px 14px;

    input {
      font-size: 15px;
    }

    svg {
      width: 18px;
      height: 18px;
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

  @media (max-width: 1350px) and (min-width: 769px) {
    font-size: 12px;
    padding: 6px 8px;
  }

  @media (max-width: 768px) {
    min-width: 150px;
    font-size: 15px;
    padding: 10px 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 1350px) {
    gap: 10px;
  }
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['hasActiveFilters', 'type'].includes(prop),
})`
  background-color: ${({ type, hasActiveFilters }) =>
    type === "clear" 
      ? hasActiveFilters ? "#FF9800" : "#c0c0c0"
      : "#1976d2"};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: ${({ hasActiveFilters }) =>
    hasActiveFilters ? "0 2px 8px rgba(255, 152, 0, 0.4)" : "none"};
  transform: ${({ hasActiveFilters }) =>
    hasActiveFilters ? "scale(1.02)" : "scale(1)"};

  &:hover {
    background-color: ${({ type, hasActiveFilters }) =>
      type === "clear" 
        ? hasActiveFilters ? "#FB8C00" : "#b0b0b0"
        : "#1565c0"};
    transform: scale(1.05);
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    font-size: 12px;
    padding: 6px 10px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 10px 14px;
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
  const lastFilteredJsonRef = useRef("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // --- Permite leer claves anidadas como "tecnico.nombre"
  const getNestedValue = (obj, key) => {
    if (!obj || !key) return "";
    return key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  };

  // Normalizar texto: quitar tildes, convertir a minúsculas y quitar espacios extra
  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const filteredData = useMemo(() => data.filter((item) => {
    const searchText = normalizeText(searchTerm);
    
    // Si no hay término de búsqueda, no filtrar por búsqueda
    if (!searchText) {
      const matchesFilters = filterOptions.every((filter) => {
        const filterKey = filter.key;
        const filterValue = filters[filterKey];
        if (!filterValue) return true;
        const rawItemValue = getNestedValue(item, filterKey);
        const itemValue =
          rawItemValue !== undefined && rawItemValue !== null
            ? rawItemValue.toString().toLowerCase()
            : "";
        return itemValue === filterValue.toString().toLowerCase();
      });
      return matchesFilters;
    }

    // Dividir el término de búsqueda en palabras individuales
    const searchWords = searchText.split(/\s+/).filter(word => word.length > 0);

    // Construir un array con todos los valores de búsqueda
    const searchableValues = [];
    
    // Agregar valores individuales de cada searchKey
    searchKeys.forEach((key) => {
      const raw = getNestedValue(item, key);
      if (raw !== undefined && raw !== null) {
        searchableValues.push(normalizeText(raw));
      }
    });

    // Si hay campos nombre y apellido, agregar el nombre completo
    const hasNombre = searchKeys.includes("nombre");
    const hasApellido = searchKeys.includes("apellido");
    if (hasNombre && hasApellido) {
      const nombre = getNestedValue(item, "nombre") || "";
      const apellido = getNestedValue(item, "apellido") || "";
      const nombreCompleto = normalizeText(`${nombre} ${apellido}`);
      if (nombreCompleto) {
        searchableValues.push(nombreCompleto);
      }
    }

    // Unir todos los valores en un solo texto para búsqueda
    const combinedText = searchableValues.join(" ");

    // Buscar: TODAS las palabras deben aparecer en algún lugar del texto combinado
    const matchesSearch = searchKeys.length === 0 
      ? true 
      : searchWords.every(word => combinedText.includes(word));

    // Aplicar filtros (filterOptions)
    const matchesFilters = filterOptions.every((filter) => {
      const filterKey = filter.key;
      const filterValue = filters[filterKey];

      if (!filterValue) return true;

      // soporta claves anidadas también para filtros si hace falta
      const rawItemValue = getNestedValue(item, filterKey);
      const itemValue =
        rawItemValue !== undefined && rawItemValue !== null
          ? rawItemValue.toString().toLowerCase()
          : "";

      return itemValue === filterValue.toString().toLowerCase();
    });

    return matchesSearch && matchesFilters;
  }), [data, filters, searchTerm, searchKeys, filterOptions]);

  useEffect(() => {
    // Crear un JSON completo de los datos filtrados para detectar cualquier cambio
    const currentJson = JSON.stringify(filteredData);
    
    // Solo actualizar si realmente cambió el contenido
    if (currentJson !== lastFilteredJsonRef.current) {
      console.log('🔄 BaseFilters: Datos filtrados cambiaron, notificando al padre...');
      lastFilteredJsonRef.current = currentJson;
      onFilteredChange?.(filteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData]);

  // Detectar si hay filtros activos
  const hasActiveFilters = searchTerm !== "" || Object.values(filters).some(val => val !== "" && val !== undefined);

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
        <Button type="clear" onClick={handleClearFilters} hasActiveFilters={hasActiveFilters}>
          Limpiar filtros
        </Button>
      </ButtonGroup>
    </FiltersContainer>
  );
};

export default BaseFilters;