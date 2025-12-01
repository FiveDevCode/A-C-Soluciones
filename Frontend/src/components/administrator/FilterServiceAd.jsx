import BaseFilters from "../common/BaseFilters";

const FilterServicesAd = ({ services = [], onFilteredChange }) => {

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={services}
      placeholder="Buscar por nombre..."
      filterOptions={filterOptions}
      searchKeys={["nombre"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterServicesAd;
