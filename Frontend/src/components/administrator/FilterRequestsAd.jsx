import BaseFilters from "../common/BaseFilters";

const FilterRequestsAd = ({ requests = [], onFilteredChange }) => {
  // Definir todos los estados disponibles
  const statusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "aceptada", label: "Aceptada" },
    { value: "rechazada", label: "Rechazada" },
  ];

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
