import BaseTable from "../common/BaseTable";
import EditBillAd from "./EditBillAd";
import ViewBillDetailAd from "./ViewBillDetailAd";

const ListBillAd = ({ bills, reloadData, onSelectRows, isLoadingData = false }) => {
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
        
        const d = new Date(value);
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();

        let hours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
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
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "numero_factura",
        subtitle: "cliente"
      }}
    />
  );
};

export default ListBillAd;
