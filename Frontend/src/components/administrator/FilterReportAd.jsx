import BaseFilters from "../common/BaseFilters";

const FilterReportAd = ({ reports = [], onFilteredChange }) => {

  const filterOptions = [
    {
      key: "visita_asociada.fecha_programada", // ← clave correcta del JSON
      label: "Fecha programada",
      type: "dateRange",
    }
  ];

  return (
    <BaseFilters
      data={reports}
      placeholder="Buscar por notas..."
      filterOptions={filterOptions}
      searchKeys={["visita_asociada.notas", "notas"]} 
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterReportAd;
