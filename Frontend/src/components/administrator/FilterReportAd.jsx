import BaseFilters from "../common/BaseFilters";

const FilterReportAd = ({ visits = [], onFilteredChange }) => {
  // Opciones dinámicas basadas en los datos existentes
  const fechaOptions = [...new Set(visits.map((v) => v.fecha_programada?.substring(0, 10)).filter(Boolean))].map(
    (f) => ({
      value: f,
      label: f,
    })
  );

  const filterOptions = [
    {
      key: "fecha_programada",
      label: "Fecha programada",
      options: fechaOptions,
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
