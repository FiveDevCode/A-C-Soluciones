import BaseFilters from "../common/BaseFilters";

const FilterMaintenanceReportAd = ({ reports = [], onFilteredChange }) => {
  // Opciones dinámicas basadas en los datos existentes
  const cityOptions = [...new Set(reports.map((r) => r.ciudad).filter(Boolean))].map(
    (city) => ({
      value: city,
      label: city,
    })
  );

  const encargadoOptions = [...new Set(reports.map((r) => r.encargado).filter(Boolean))].map(
    (enc) => ({
      value: enc,
      label: enc,
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
      key: "encargado",
      label: "Encargado",
      options: encargadoOptions,
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
