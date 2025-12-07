import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditTechnicalAd from "./EditTechnicalAd";
import ViewTechnicalDetailAd from "./ViewTechnicalDetailAd";

const ListTechnicalAd = ({ technicals, reloadData, onSelectRows, isLoadingData = false }) => {
  const EditComponentMemo = useCallback((props) => <EditTechnicalAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewTechnicalDetailAd {...props} />, []);
  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Apellido", accessor: "apellido" },
    { header: "Especialidad", accessor: "especialidad" },
    { header: "Correo Electrónico", accessor: "correo_electronico" },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    },
  ];

  return (
    <BaseTable
      data={technicals}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay técnicos registrados"
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "nombre",
        subtitle: "especialidad"
      }}
    />
  );
};

export default ListTechnicalAd;
