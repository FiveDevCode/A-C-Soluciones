import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditPaymentAccountAd from "./EditPaymentAccountAd";
import ViewPaymentAccountDetailAd from "./ViewPaymentAccountDetailAd";

const ListPaymentAccountAd = ({ accounts, reloadData, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const EditComponentMemo = useCallback((props) => <EditPaymentAccountAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewPaymentAccountDetailAd {...props} />, []);
  const columns = [
    { header: "N° Cuenta", accessor: "numero_cuenta" },
    { header: "NIT", accessor: "nit" },
    {
      header: "Cliente",
      accessor: "cliente",
      render: (value) =>
        value
          ? `${value.numero_de_cedula || ""} - ${value.nombre || ""} ${value.apellido || ""}`.trim()
          : "Sin cliente vinculado",
    },
    {
      header: "Fecha de registro",
      accessor: "fecha_registro",
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
  ];

  return (
    <BaseTable
      data={accounts}
      columns={columns}
      emptyMessage="No hay cuentas de pago registradas"
      getBadgeValue={(row) => row.estado}
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "numero_de_cuenta",
        subtitle: "banco"
      }}
    />
  );
};

export default ListPaymentAccountAd;
