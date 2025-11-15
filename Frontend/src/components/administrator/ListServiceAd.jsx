import BaseTable from "../common/BaseTable";
import EditServiceAd from "./EditServiceAd";
import ViewServiceDetailAd from "./ViewServiceDetailAd";

const ListServiceAd = ({ services, reloadData, onSelectRows }) => {

  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    },
    {
      header: "Fecha de creación",
      accessor: "fecha_creacion",
      render: (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleDateString("es-CO");
      }
    }
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
