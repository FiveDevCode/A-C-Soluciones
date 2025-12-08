import BaseFilters from "../common/BaseFilters";

const FilterAdministratorAd = ({ administrators = [], onFilteredChange }) => {
  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={administrators}
      placeholder="Buscar por nombre o cédula..."
      filterOptions={filterOptions}
      searchKeys={["nombre", "apellido", "numero_cedula"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterAdministratorAd;
