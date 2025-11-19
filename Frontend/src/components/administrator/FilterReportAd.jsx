import BaseFilters from "../common/BaseFilters";

const FilterReportAd = ({ visits = [], onFilteredChange }) => {
  // Opciones dinámicas basadas en los datos existentes
  const fechaOptions = [...new Set(visits.map((v) => v.fecha_programada?.substring(0, 10)).filter(Boolean))].map(
    (f) => ({
      value: f,
      label: f,
    })
  );

  const notasPreviasOptions = [...new Set(visits.map((v) => v.notas_previas).filter(Boolean))].map(
    (np) => ({
      value: np,
      label: np.length > 30 ? np.slice(0, 30) + "..." : np,
    })
  );

  const notasPosterioresOptions = [...new Set(visits.map((v) => v.notas_posteriores).filter(Boolean))].map(
    (ns) => ({
      value: ns,
      label: ns.length > 30 ? ns.slice(0, 30) + "..." : ns,
    })
  );

  const filterOptions = [
    {
      key: "fecha_programada",
      label: "Fecha programada",
      options: fechaOptions,
    },
    {
      key: "notas_previas",
      label: "Notas previas",
      options: notasPreviasOptions,
    },
    {
      key: "notas_posteriores",
      label: "Notas posteriores",
      options: notasPosterioresOptions,
    },
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
