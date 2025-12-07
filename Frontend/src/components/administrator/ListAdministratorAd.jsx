import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditAdministratorAd from "./EditAdministratorAd";
import ViewAdministratorDetailAd from "./ViewAdministratorDetailAd";

const ListAdministratorAd = ({ administrators, reloadData, onSelectRows, isLoadingData = false }) => {
  const EditComponentMemo = useCallback((props) => <EditAdministratorAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewAdministratorDetailAd {...props} />, []);
  const columns = [
    { header: "Cédula", accessor: "numero_cedula" },
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
      data={administrators}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay administradores registrados"
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "nombre",
        subtitle: "numero_cedula"
      }}
    />
  );
};

export default ListAdministratorAd;
