import BaseTable from "../common/BaseTable";
import EditBillAd from "./EditBillAd";
import ViewBillDetailAd from "./ViewBillDetailAd";

const ListBillAd = ({ bills, reloadData, onSelectRows }) => {
  const columns = [
    { header: "Número de factura", accessor: "numero_factura" },
    {
      header: "Cliente",
      accessor: "cliente",
      render: (value) =>
        value
          ? `${value.nombre || ""} ${value.apellido || ""}`.trim()
          : "Sin cliente vinculado",
    },
    {
      header: "Fecha de factura",
      accessor: "fecha_factura",
      render: (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleDateString("es-CO"); // 🇨🇴 → DD/MM/YYYY
      }
    },   
    {
      header: "Monto facturado",
      accessor: "monto_facturado",
      render: (value) => {
        if (value == null) return "—";
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(value);
      }
    },
    { header: "Estado", accessor: "estado_factura" },
  ];

  return (
    <BaseTable
      data={bills}
      columns={columns}
      emptyMessage="No hay facturas registradas"
      EditComponent={(props) => (
        <EditBillAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewBillDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListBillAd;
