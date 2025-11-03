import BaseFilters from "../common/BaseFilters";

const FilterInventoryAd = ({ inventory = [], onFilteredChange }) => {
  const filterOptions = [
    {
      key: "categoria",
      label: "Categoría",
      options: [...new Set(inventory.map((i) => i.categoria).filter(Boolean))],
    },
    {
      key: "estado_herramienta",
      label: "Estado herramienta",
      options: ["activo", "inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={inventory}
      placeholder="Buscar por nombre o categoría..."
      filterOptions={filterOptions}
      searchKeys={["nombre", "categoria"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterInventoryAd;
