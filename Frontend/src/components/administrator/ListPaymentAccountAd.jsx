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
        
        // Restar 5 horas para Colombia (UTC-5)
        const colombiaTime = new Date(d.getTime() - (5 * 60 * 60 * 1000));
        
        const day = String(colombiaTime.getUTCDate()).padStart(2, "0");
        const month = String(colombiaTime.getUTCMonth() + 1).padStart(2, "0");
        const year = colombiaTime.getUTCFullYear();

        return `${day}/${month}/${year}`;
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
        title: "numero_cuenta",
        subtitle: "nit"
      }}
    />
  );
};

export default ListPaymentAccountAd;