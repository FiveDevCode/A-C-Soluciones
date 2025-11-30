import BaseTable from "../common/BaseTable";
import EditBillAd from "./EditBillAd";
import ViewBillDetailAd from "./ViewBillDetailAd";

const ListBillAd = ({ bills, reloadData, onSelectRows }) => {
  const columns = [
    {
      header: "Número de factura",
      accessor: "numero_factura",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Cliente",
      accessor: "cliente",
      render: (value) => {
        if (!value) return "Sin cliente vinculado";
        const fullName = `${value.nombre || ""} ${value.apellido || ""}`.trim();
        return fullName || "Sin nombre";
      }
    },
    {
      header: "Fecha de factura",
      accessor: "fecha_factura",
      render: (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleDateString("es-CO");
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
    {
      header: "Estado",
      accessor: "estado_factura",
      isBadge: true,
    },
  ];

  return (
    <BaseTable
      data={bills}
      columns={columns}
      getBadgeValue={(row) => row.estado_factura}
      emptyMessage="No hay facturas registradas"
      EditComponent={(props) => (
        <EditBillAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewBillDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
      mobileConfig={{
        title: "numero_factura",
        subtitle: "cliente"
      }}
    />
  );
};

export default ListBillAd;
