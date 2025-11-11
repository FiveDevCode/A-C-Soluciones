import BaseFilters from "../common/BaseFilters";

const FilterAccountingAd = ({ accountings = [], onFilteredChange }) => {
  const roleLabels = {
    contador: "Contador",
    auxiliar: "Auxiliar contable",
    analista: "Analista financiero",
  };

  const roleOptions = [...new Set(accountings.map((i) => i.cargo).filter(Boolean))].map(
    (role) => ({
      value: role,
      label: roleLabels[role] || role,
    })
  );

  const filterOptions = [
    {
      key: "cargo",
      label: "Cargo",
      options: roleOptions,
    },
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
