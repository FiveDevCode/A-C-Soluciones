import BaseFilters from "../common/BaseFilters";

const FilterMaintenanceReportAd = ({ reports = [], onFilteredChange }) => {
  // Opciones dinámicas basadas en los datos existentes
  const cityOptions = [...new Set(reports.map((r) => r.ciudad).filter(Boolean))].map(
    (city) => ({
      value: city,
      label: city,
    })
  );

  const marcaOptions = [...new Set(reports.map((r) => r.marca_generador).filter(Boolean))].map(
    (marca) => ({
      value: marca,
      label: marca,
    })
  );

  const filterOptions = [
    {
      key: "ciudad",
      label: "Ciudad",
      options: cityOptions,
    },
    {
      key: "marca_generador",
      label: "Marca generador",
      options: marcaOptions,
    },
  ];

  return (
    <BaseFilters
      data={reports}
      placeholder="Buscar por dirección o teléfono..."
      filterOptions={filterOptions}
      searchKeys={["direccion", "telefono"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterMaintenanceReportAd;
