import { useEffect, useState } from "react";
import BaseFilters from "../common/BaseFilters";

const FilterInventoryAd = ({ inventory = [], onFilteredChange }) => {
  const [filters, setFilters] = useState({
    categoria: "",
    estado: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filterOptions = [
    {
      key: "categoria",
      label: "Categoría",
      options: [...new Set(inventory.map((i) => i.categoria).filter(Boolean))],
    },
    {
      key: "estado",
      label: "Estado herramienta",
      options: ["activo", "inactivo"],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ categoria: "", estado: "" });
    setSearchTerm("");
  };

  // Filtrado
  const filteredInventory = inventory.filter((item) => {
    const nombre = item.nombre?.toLowerCase() || "";
    const categoria = item.categoria?.toLowerCase() || "";
    const estado = item.estado_herramienta?.toLowerCase() || "";

    return (
      (filters.categoria ? categoria === filters.categoria.toLowerCase() : true) &&
      (filters.estado ? estado === filters.estado.toLowerCase() : true) &&
      (nombre.includes(searchTerm.toLowerCase()) ||
        categoria.includes(searchTerm.toLowerCase()))
    );
  });

  useEffect(() => {
    onFilteredChange?.(filteredInventory);
  }, [filters, searchTerm, inventory]);

  return (
    <BaseFilters
      placeholder="Buscar por nombre o categoría..."
      filters={filterOptions}
      onSearchChange={setSearchTerm}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
    />
  );
};

export default FilterInventoryAd;
