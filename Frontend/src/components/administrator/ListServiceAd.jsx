import BaseTable from "../common/BaseTable";
import EditServiceAd from "./EditServiceAd";
import ViewServiceDetailAd from "./ViewServiceDetailAd";

const ListServiceAd = ({ services, reloadData, onSelectRows }) => {
  const statusLabels = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completado: "Completado",
  };

  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    },
    { header: "Fecha de creación", accessor: "fecha_creacion" },
  ];

  return (
    <BaseTable
      data={services}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay servicios registrados"
      EditComponent={(props) => (
        <EditServiceAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewServiceDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListServiceAd;
