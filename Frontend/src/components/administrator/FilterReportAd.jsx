import BaseFilters from "../common/BaseFilters";

const FilterReportAd = ({ visits = [], onFilteredChange }) => {
  const filterOptions = [
    {
      key: "fecha_programada",
      label: "Fecha programada", // 👈 Este label ahora se muestra arriba
      type: "dateRange",
    }
  ];

  return (
    <BaseFilters
      data={visits}
      placeholder="Buscar por notas..."
      filterOptions={filterOptions}
      searchKeys={["notas_previas", "notas_posteriores"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterReportAd;