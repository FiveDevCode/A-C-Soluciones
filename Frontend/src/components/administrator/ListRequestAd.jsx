import BaseTable from "../common/BaseTable";
import ViewRequestDetailAd from "./ViewRequestDetailAd";

const ListRequestAd = ({ requests, onSelectRows, onUpdate }) => {
  const columns = [
    {
      header: "Comentarios",
      accessor: "comentarios",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Descripción",
      accessor: "descripcion",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Fecha de solicitud",
      accessor: "fecha_solicitud",
      render: (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleDateString("es-CO");
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
      data={requests}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay solicitudes registradas"
      ViewComponent={(props) => (
        <ViewRequestDetailAd {...props} onUpdate={onUpdate} />
      )}
      onSelectRows={onSelectRows}
      mobileConfig={{
        title: "descripcion",
        subtitle: "fecha_solicitud"
      }}
    />
  );
};

export default ListRequestAd;
