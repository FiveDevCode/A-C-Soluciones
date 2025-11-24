import BaseTable from "../common/BaseTable";
import EditClientAd from "./EditClientAd";
import ViewClientDetailAd from "./ViewClientDetailAd";

const ListClientAd = ({ clients, reloadData, onSelectRows }) => {
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
      data={clients}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay clientes registrados"
      EditComponent={(props) => (
        <EditClientAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewClientDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListClientAd;
