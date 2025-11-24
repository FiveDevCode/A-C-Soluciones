import BaseFilters from "../common/BaseFilters";

const FilterServicesAd = ({ services = [], onFilteredChange }) => {
  const statusLabels = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completado: "Completado",
  };

  const statusOptions = [...new Set(services.map((s) => s.estado).filter(Boolean))].map(
    (st) => ({
      value: st,
      label: statusLabels[st] || st,
    })
  );

  const filterOptions = [
    {
      key: "estado",
      label: "Estado del servicio",
      options: statusOptions,
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
