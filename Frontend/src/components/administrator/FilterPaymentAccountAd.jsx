import BaseFilters from "../common/BaseFilters";

const FilterPaymentAccountAd = ({ accounts = [], onFilteredChange }) => {
  // Obtener lista de NIT únicos
  const nitOptions = [...new Set(accounts.map((a) => a.nit).filter(Boolean))].map((nit) => ({
    value: nit,
    label: nit,
  }));

  // Si tus cuentas tienen cliente asociado
  const clientOptions = [
    ...new Set(
      accounts
        .map((a) => a.cliente?.nombre)
        .filter((name) => Boolean(name))
    ),
  ].map((name) => ({
    value: name,
    label: name,
  }));

  const filterOptions = [
    {
      key: "nit",
      label: "NIT",
      options: nitOptions,
    },
    {
      key: "cliente.nombre",
      label: "Cliente",
      options: clientOptions,
    },
  ];

  return (
    <BaseFilters
      data={accounts}
      placeholder="Buscar por número de cuenta o NIT..."
      filterOptions={filterOptions}
      searchKeys={["numero_cuenta", "nit", "cliente.nombre", "cliente.apellido"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterPaymentAccountAd;
