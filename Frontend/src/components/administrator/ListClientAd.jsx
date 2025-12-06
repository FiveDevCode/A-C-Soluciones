import BaseTable from "../common/BaseTable";
import EditClientAd from "./EditClientAd";
import ViewClientDetailAd from "./ViewClientDetailAd";

const ListClientAd = ({ clients, reloadData, onSelectRows, isLoadingData = false }) => {
  const columns = [
    { header: "Cédula", accessor: "numero_de_cedula" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Apellido", accessor: "apellido" },
    { header: "Correo Electrónico", accessor: "correo_electronico" },
    {
      header: "Tipo",
      accessor: "tipo_cliente",
      isBadge: true,
    },
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
      getBadgeValue={(row, accessor) => row[accessor]}
      emptyMessage="No hay clientes registrados"
      EditComponent={(props) => (
        <EditClientAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewClientDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "nombre",
        subtitle: "numero_de_cedula"
      }}
    />
  );
};

export default ListClientAd;
