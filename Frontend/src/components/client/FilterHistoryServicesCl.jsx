import BaseFilters from "../common/BaseFilters";

const FilterHistoryServicesCl = ({ historyServices = [], onFilteredChange }) => {
  // Opciones dinámicas basadas en los datos existentes
  const statusLabels = {
    programada: "Programada",
    iniciada: "Iniciada",
    en_camino: "En Camino",
    completada: "Completada",
    completado: "Completado",
    cancelada: "Cancelada",
  };

  const statusOptions = [...new Set(historyServices.map((h) => h.estado).filter(Boolean))].map(
    (st) => ({
      value: st,
      label: statusLabels[st] || st,
    })
  );

  const serviceOptions = [...new Set(historyServices.map((h) => h.servicio).filter(Boolean))].map(
    (service) => ({
      value: service,
      label: service,
    })
  );

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: statusOptions,
    },
    {
      key: "servicio",
      label: "Servicio",
      options: serviceOptions,
    },
  ];

  return (
    <BaseFilters
      data={historyServices}
      placeholder="Buscar por servicio, técnico..."
      filterOptions={filterOptions}
      searchKeys={["servicio", "tecnico"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterHistoryServicesCl;

