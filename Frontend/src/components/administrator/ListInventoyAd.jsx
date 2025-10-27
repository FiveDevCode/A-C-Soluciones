import BaseTable from "../common/BaseTable";

const ListInventoryAd = ({ inventory }) => {
  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Categoría", accessor: "categoria" },
    { header: "Cantidad", accessor: "cantidad_disponible" },
    { header: "Estado", accessor: "estado" },
    { header: "Estado de la herramienta", accessor: "estado_herramienta", isBadge: true },
  ];

  return (
    <BaseTable
      data={inventory}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      editPath="/admin/editar-inventario"
      getBadgeValue={(row) => row.estado_herramienta}
      emptyMessage="No hay herramientas registradas"
    />
  );
};

export default ListInventoryAd;
