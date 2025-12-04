import BaseFilters from "../common/BaseFilters";

const FilterClientAd = ({ clients = [], onFilteredChange }) => {

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["activo", "inactivo"],
    },
    {
      key: "tipo_cliente",
      label: "Tipo de Cliente",
      options: ["regular", "fijo"],
    },
  ];

  return (
    <BaseFilters
      data={clients}
      placeholder="Buscar por nombre o cédula..."
      filterOptions={filterOptions}
      searchKeys={["nombre", "apellido", "numero_de_cedula"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterClientAd;
