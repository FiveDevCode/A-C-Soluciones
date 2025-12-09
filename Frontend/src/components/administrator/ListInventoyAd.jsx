import { useCallback } from "react";
import BaseTable from "../common/BaseTable";
import EditInventoryAd from "./EditInventoryAd";
import ViewInventoryDetail from "./ViewInventoryDetailAd";


const ListInventoyAd = ({ inventory, reloadData, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const EditComponentMemo = useCallback((props) => <EditInventoryAd {...props} onSuccess={reloadData} />, [reloadData]);
  const ViewComponentMemo = useCallback((props) => <ViewInventoryDetail {...props} />, []);
  const categoryLabels = {
    manuales: "Manual",
    electricas: "Eléctrica",
    medicion: "Medición",
  };
  
  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Nombre", accessor: "nombre" },
    {
      header: "Categoría",
      accessor: "categoria",
      render: (value) => (
        <span>
          {categoryLabels[value] || value}
        </span>
      ),
    },
    { header: "Cantidad", accessor: "cantidad_disponible" },
    {
      header: "Estado de la herramienta",
      accessor: "estado_herramienta",
      isBadge: true,
    },
  ];

  return (
    <BaseTable
      data={inventory}
      columns={columns}
      getBadgeValue={(row) => row.estado_herramienta}
      emptyMessage="No hay herramientas registradas"
      EditComponent={EditComponentMemo}
      ViewComponent={ViewComponentMemo}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "nombre",
        subtitle: "cantidad"
      }}
    />
  );
};

export default ListInventoyAd;