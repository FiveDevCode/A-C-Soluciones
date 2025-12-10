import BaseFilters from "../common/BaseFilters";

const FilterBillAd = ({ bills = [], onFilteredChange }) => {

  const billsWithClientData = bills.map(bill => ({
    ...bill,
    nombre_cliente: bill.cliente?.nombre || "",
    apellido_cliente: bill.cliente?.apellido || "",
    cedula_cliente: bill.cliente?.numero_de_cedula || "",
    nombre_completo_cliente: bill.cliente ? `${bill.cliente.nombre} ${bill.cliente.apellido}` : "",
  }));

  const paymentStatusLabels = {
    pagada: "Pagada",
    pendiente: "Pendiente",
    vencida: "Vencida",
  };

  const paymentStatusOptions = [...new Set(bills.map(b => b.estado_factura).filter(Boolean))]
    .map(status => ({
      value: status,
      label: paymentStatusLabels[status] || status,
    }));

  const filterOptions = [
    {
      key: "estado_factura",
      label: "Estado de pago",
      options: paymentStatusOptions,
    },
  ];

  return (
    <BaseFilters
      data={billsWithClientData}
      placeholder="Buscar por número de factura, nombre o cédula..."
      filterOptions={filterOptions}
      searchKeys={[
        "numero_factura",
        "nombre_cliente",
        "apellido_cliente",
        "cedula_cliente",
        "nombre_completo_cliente"
      ]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterBillAd;
