import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditBillAd from "./EditBillAd";
import ViewBillDetailAd from "./ViewBillDetailAd";

const ListBillAd = ({ bills, reloadData, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const EditComponentMemo = useCallback((props) => <EditBillAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewBillDetailAd {...props} />, []);
  
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
        const fullName = `${value.numero_de_cedula || ""} - ${value.nombre || ""} ${value.apellido || ""}`.trim();
        return fullName || "Sin nombre";
      }
    },
    {
      header: "Fecha de factura",
      accessor: "fecha_factura",
      render: (value) => {
        if (!value) return "—";
        
        const d = new Date(value);
        
        // Restar 5 horas para Colombia (UTC-5)
        const colombiaTime = new Date(d.getTime() - (5 * 60 * 60 * 1000));
        
        const day = String(colombiaTime.getUTCDate()).padStart(2, "0");
        const month = String(colombiaTime.getUTCMonth() + 1).padStart(2, "0");
        const year = colombiaTime.getUTCFullYear();

        return `${day}/${month}/${year}`;
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
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "numero_factura",
        subtitle: "concepto"
      }}
    />
  );
};

export default ListBillAd;