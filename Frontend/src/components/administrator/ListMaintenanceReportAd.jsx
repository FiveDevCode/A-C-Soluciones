import BaseTable from "../common/BaseTable";
import ViewMaintenanceReportDetailAd from "./ViewMaintenanceReportDetailAd";

const ListMaintenanceReportAd = ({ reports, reloadData, onSelectRows }) => {
  const columns = [
    { header: "Fecha", accessor: "fecha" },
    { header: "Ciudad", accessor: "ciudad" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Encargado", accessor: "encargado" },
    { header: "Marca generador", accessor: "marca_generador" },
    { header: "Modelo generador", accessor: "modelo_generador" },
    { header: "KVA", accessor: "kva" },
  ];

  return (
    <BaseTable
      data={reports}
      columns={columns}
      emptyMessage="No hay reportes registrados"
      ViewComponent={(props) => (
        <ViewMaintenanceReportDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListMaintenanceReportAd;
