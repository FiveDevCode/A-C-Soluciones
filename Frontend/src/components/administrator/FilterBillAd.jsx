import BaseFilters from "../common/BaseFilters";

const FilterBillAd = ({ bills = [], onFilteredChange }) => {
  const paymentStatusLabels = {
    pagada: "Pagada",
    pendiente: "Pendiente",
    vencido: "Vencido",
  };

  const paymentStatusOptions = [...new Set(bills.map((b) => b.estado_factura).filter(Boolean))].map(
    (status) => ({
      value: status,
      label: paymentStatusLabels[status] || status,
    })
  );

  const filterOptions = [
    {
      key: "estado_factura",
      label: "Estado de pago",
      options: paymentStatusOptions,
    },
  ];

  return (
    <BaseFilters
      data={bills}
      placeholder="Buscar por número de factura o cliente..."
      filterOptions={filterOptions}
      searchKeys={["numero_factura", "nombre_cliente"]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterBillAd;
