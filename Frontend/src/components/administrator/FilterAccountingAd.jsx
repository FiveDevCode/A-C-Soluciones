import BaseFilters from "../common/BaseFilters";

const FilterAccountingAd = ({ accountings = [], onFilteredChange }) => {

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <BaseFilters
      data={accountings}
      placeholder="Buscar por nombre o cédula..."
      filterOptions={filterOptions}
      searchKeys={["nombre", "apellido", "numero_de_cedula"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterAccountingAd;
