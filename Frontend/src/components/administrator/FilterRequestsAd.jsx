import BaseFilters from "../common/BaseFilters";

const FilterRequestsAd = ({ requests = [], onFilteredChange }) => {
  const statusLabels = {
    pendiente: "Pendiente",
    aceptada: "Aceptada",
    completada: "Completada",
  };

  const statusOptions = [...new Set(requests.map((r) => r.estado).filter(Boolean))].map(
    (st) => ({
      value: st,
      label: statusLabels[st] || st,
    })
  );

  const filterOptions = [
    {
      key: "estado",
      label: "Estado de la solicitud",
      options: statusOptions,
    },
  ];

  return (
    <BaseFilters
      data={requests}
      placeholder="Buscar por nombre..."
      filterOptions={filterOptions}
      searchKeys={["nombre"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterRequestsAd;
