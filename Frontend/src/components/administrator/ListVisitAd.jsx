import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";

const ListVisitAd = ({ visits, reloadData, onSelectRows }) => {
  const columns = [
    {
      header: "Notas Previas",
      accessor: "notas_previas",
      render: (value) =>
        value
          ? value
          : "Sin notas previas",
    },
    {
      header: "Notas Posteriores",
      accessor: "notas_posteriores",
      render: (value) =>
        value
          ? value
          : "Sin notas posteriores",
    },
    {
      header: "Fecha Programada",
      accessor: "fecha_programada",
      render: (value) => value?.substring(0, 10),
    },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
      render: (value) => (value === "en_camino" ? "En camino" : value),
    },
  ];

  return (
    <BaseTable
      data={visits}
      columns={columns}
      getBadgeValue={(row) =>
        row.estado === "en_camino" ? "En camino" : row.estado
      }
      emptyMessage="No hay visitas registradas"
      EditComponent={(props) => (
        <EditVisitAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => <ViewVisitDetailAd {...props} />}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListVisitAd;
