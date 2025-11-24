import BaseFilters from "../common/BaseFilters";

const FilterTechnicalsAd = ({ technicals = [], onFilteredChange }) => {

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={technicals}
      placeholder="Buscar por nombre o cédula..."
      filterOptions={filterOptions}
      searchKeys={["nombre", "apellido", "numero_de_cedula"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterTechnicalsAd;
