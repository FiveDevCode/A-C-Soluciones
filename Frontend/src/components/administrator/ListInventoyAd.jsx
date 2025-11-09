import BaseTable from "../common/BaseTable";
import EditInventoryAd from "./EditInventoryAd";
import ViewInventoryDetail from "./ViewInventoryDetailAd";


const ListInventoryAd = ({ inventory, reloadData, onSelectRows }) => {
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
    { header: "Estado", accessor: "estado" },
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
      EditComponent={(props) => (
        <EditInventoryAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewInventoryDetail {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListInventoryAd;