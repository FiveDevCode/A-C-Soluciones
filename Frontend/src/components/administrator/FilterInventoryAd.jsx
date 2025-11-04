import BaseFilters from "../common/BaseFilters";

const FilterInventoryAd = ({ inventory = [], onFilteredChange }) => {
  const categoryLabels = {
    manuales: "Manual",
    electricas: "Eléctrica",
    medicion: "Medición",
  };

  const categoryOptions = [...new Set(inventory.map((i) => i.categoria).filter(Boolean))].map(
    (cat) => ({
      value: cat,
      label: categoryLabels[cat] || cat,
    })
  );

  const filterOptions = [
    {
      key: "categoria",
      label: "Categoría",
      options: categoryOptions,
    },
    {
      key: "estado_herramienta",
      label: "Estado herramienta",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={inventory}
      placeholder="Buscar por nombre o código..."
      filterOptions={filterOptions}
      searchKeys={["codigo", "nombre"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterInventoryAd;