import BaseFilters from "../common/BaseFilters";

const FilterPumpingReportAd = ({ reports = [], onFilteredChange }) => {
  // Opciones dinámicas: ciudad
  const cityOptions = [...new Set(reports.map((r) => r.ciudad).filter(Boolean))].map(
    (city) => ({
      value: city,
      label: city,
    })
  );

  // Opciones dinámicas: encargado
  const encargadoOptions = [...new Set(reports.map((r) => r.encargado).filter(Boolean))].map(
    (enc) => ({
      value: enc,
      label: enc,
    })
  );

  // Opciones dinámicas: marcas de equipos
  const marcaOptions = [
    ...new Set(
      reports
        .flatMap((r) => r.equipos?.map((e) => e.marca) || [])
        .filter(Boolean)
    ),
  ].map((marca) => ({
    value: marca,
    label: marca,
  }));

  const filterOptions = [
    {
      key: "ciudad",
      label: "Ciudad",
      options: cityOptions,
    },
    // {
    //   key: "encargado",
    //   label: "Encargado",
    //   options: encargadoOptions,
    // },
    {
      key: "equipos.marca",
      label: "Marca de equipo",
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

export default FilterPumpingReportAd;
