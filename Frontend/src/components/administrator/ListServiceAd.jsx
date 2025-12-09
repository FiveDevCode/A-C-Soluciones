import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditServiceAd from "./EditServiceAd";
import ViewServiceDetailAd from "./ViewServiceDetailAd";

const ListServiceAd = ({ services, reloadData, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const EditComponentMemo = useCallback((props) => <EditServiceAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewServiceDetailAd {...props} />, []);

  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Fecha de creación",
      accessor: "fecha_creacion",
      render: (value) => {
        if (!value) return "—";
        
        const d = new Date(value);
        
        // Restar 5 horas para Colombia (UTC-5)
        const colombiaTime = new Date(d.getTime() - (10 * 60 * 60 * 1000));
        
        const day = String(colombiaTime.getUTCDate()).padStart(2, "0");
        const month = String(colombiaTime.getUTCMonth() + 1).padStart(2, "0");
        const year = colombiaTime.getUTCFullYear();

        let hours = colombiaTime.getUTCHours();
        const minutes = String(colombiaTime.getUTCMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
      }
    },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    }
  ];

  return (
    <BaseTable
      data={services}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay servicios registrados"
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "nombre",
        subtitle: "descripcion"
      }}
    />
  );
};

export default ListServiceAd;
