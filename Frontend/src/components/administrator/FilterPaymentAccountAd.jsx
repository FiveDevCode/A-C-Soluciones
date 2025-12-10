import BaseFilters from "../common/BaseFilters";

const FilterPaymentAccountAd = ({ accounts = [], onFilteredChange }) => {

  const accountsWithClientData = accounts.map(acc => ({
    ...acc,
    nombre_cliente: acc.cliente?.nombre || "",
    apellido_cliente: acc.cliente?.apellido || "",
    cedula_cliente: acc.cliente?.numero_de_cedula || "",
  }));

  return (
    <BaseFilters
      data={accountsWithClientData}
      placeholder="Buscar por número de cuenta, NIT, nombre o cédula..."
      searchKeys={[
        "numero_cuenta",
        "nit",
        "nombre_cliente",
        "apellido_cliente",
        "cedula_cliente"
      ]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterPaymentAccountAd;
