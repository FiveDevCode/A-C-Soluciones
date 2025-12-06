import BaseTable from "../common/BaseTable";
import EditPaymentAccountAd from "./EditPaymentAccountAd";
import ViewPaymentAccountDetailAd from "./ViewPaymentAccountDetailAd";

const ListPaymentAccountAd = ({ accounts, reloadData, onSelectRows, isLoadingData = false }) => {
  const columns = [
    { header: "N° Cuenta", accessor: "numero_cuenta" },
    { header: "NIT", accessor: "nit" },
    {
      header: "Cliente",
      accessor: "cliente",
      render: (value) =>
        value
          ? `${value.nombre || ""} ${value.apellido || ""}`.trim()
          : "Sin cliente vinculado",
    },
    {
      header: "Fecha de registro",
      accessor: "fecha_registro",
      render: (value) => (value ? value.substring(0, 10) : "—"),
    },
  ];

  return (
    <BaseTable
      data={accounts}
      columns={columns}
      emptyMessage="No hay cuentas de pago registradas"
      getBadgeValue={(row) => row.estado}
      EditComponent={(props) => (
        <EditPaymentAccountAd {...props} onSuccess={reloadData} />
      )}
      ViewComponent={(props) => (
        <ViewPaymentAccountDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "numero_cuenta",
        subtitle: "cliente"
      }}
    />
  );
};

export default ListPaymentAccountAd;
