import BaseTable from "../common/BaseTable";
import ViewReportDetailAd from "./ViewReportDetailAd";

const ListReportAd = ({ visits, reloadData, onSelectRows }) => {
  const columns = [
    { header: "Fecha programada", accessor: "fecha_programada" },
    { header: "Notas previas", accessor: "notas_previas" },
    { header: "Notas posteriores", accessor: "notas_posteriores" },
    { header: "PDF", accessor: "pdf_path" },
  ];

  return (
    <BaseTable
      data={visits}
      columns={columns}
      emptyMessage="No hay reportes generados"
      ViewComponent={(props) => (
        <ViewReportDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
    />
  );
};

export default ListReportAd;
