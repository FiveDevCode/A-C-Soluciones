import BaseFilters from "../common/BaseFilters";

const FilterPaymentAccountAd = ({ accounts = [], onFilteredChange }) => {


  return (
    <BaseFilters
      data={accounts}
      placeholder="Buscar por número de cuenta o NIT..."
      searchKeys={["numero_cuenta", "nit", "cliente.nombre", "cliente.apellido"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterPaymentAccountAd;
