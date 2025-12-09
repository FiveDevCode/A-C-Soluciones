import BaseTable from "../common/BaseTable";
import ViewRequestDetailAd from "./ViewRequestDetailAd";

const ListRequestAd = ({ requests, onSelectRows, isLoadingData = false, clearSelectionTrigger }) => {
  const columns = [
    {
      header: "Descripción",
      accessor: "descripcion",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Comentarios",
      accessor: "comentarios",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Servicio",
      accessor: "servicio_solicitud",
      render: (value) => {
        if (!value || !value.nombre) return "—";
        return value.nombre;
      }
    },
    {
      header: "Fecha de solicitud",
      accessor: "fecha_solicitud",
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
      data={requests}
      columns={columns}
      getBadgeValue={(row) => row.estado}
      emptyMessage="No hay solicitudes registradas"
      ViewComponent={(props) => (
        <ViewRequestDetailAd {...props} onUpdate={onUpdate} />
      )}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      clearSelectionTrigger={clearSelectionTrigger}
      mobileConfig={{
        title: "descripcion",
        subtitle: "fecha_solicitud"
      }}
    />
  );
};

export default ListRequestAd;
