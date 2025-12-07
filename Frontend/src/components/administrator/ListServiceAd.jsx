import BaseTable from "../common/BaseTable";
import EditServiceAd from "./EditServiceAd";
import ViewServiceDetailAd from "./ViewServiceDetailAd";

const ListServiceAd = ({ services, reloadData, onSelectRows, isLoadingData = false }) => {

  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Fecha de creación",
      accessor: "fecha_creacion",
      render: (value) => {
        if (!value) return "—";
        
        const d = new Date(value);
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();

        let hours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
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
      EditComponent={(props) => (
        <EditServiceAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewServiceDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "nombre",
        subtitle: "descripcion"
      }}
    />
  );
};

export default ListServiceAd;
