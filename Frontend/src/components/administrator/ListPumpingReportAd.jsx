import BaseTable from "../common/BaseTable";
import ViewPumpingReportDetailAd from "./ViewPumpingReportDetailAd";

const ListPumpingReportAd = ({ reports, reloadData, onSelectRows }) => {
  const columns = [
    { header: "Fecha", accessor: "fecha" },
    { header: "Ciudad", accessor: "ciudad" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Encargado", accessor: "encargado" },
    { header: "Teléfono", accessor: "telefono" },
    { 
      header: "N° Equipos",
      render: (value, row) => row.equipos?.length || 0
    },
  ];

  return (
    <BaseTable
      data={reports}
      columns={columns}
      emptyMessage="No hay reportes registrados"
      ViewComponent={(props) => <ViewPumpingReportDetailAd {...props} />}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListPumpingReportAd;
