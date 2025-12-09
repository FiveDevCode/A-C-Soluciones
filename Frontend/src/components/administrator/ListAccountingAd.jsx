import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditAccountingAd from "./EditAccountingAd";
import ViewAccountingDetailAd from "./ViewAccountingDetailAd";

const ListAccountingAd = ({ accountings, reloadData, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const EditComponentMemo = useCallback((props) => <EditAccountingAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewAccountingDetailAd {...props} />, []);
  const columns = [
    { header: "Cédula", accessor: "numero_de_cedula" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Apellido", accessor: "apellido" },
    { header: "Correo Electrónico", accessor: "correo_electronico" },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    },
  ];

  return (
    <BaseTable
      data={accountings}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay empleados contables registrados"
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "nombre",
        subtitle: "numero_de_cedula"
      }}
    />
  );
};

export default ListAccountingAd;
