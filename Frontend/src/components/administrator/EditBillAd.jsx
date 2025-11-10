import { useEffect, useState } from "react";
import { handleGetBillAd } from "../../controllers/administrator/getBillAd.controller";
import { handleUpdateBill } from "../../controllers/administrator/updateBillAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import BaseEditModal from "../common/BaseEditModalAd";

const EditBillAd = ({ selected, onClose, onSuccess }) => {
  const [billData, setBillData] = useState(null);
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billRes, clientsRes] = await Promise.all([
          handleGetBillAd(selected.id),
          handleGetListClient(),
        ]);
        setBillData(billRes.data);
        setClientList(clientsRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos de factura:", error);
      }
    };
    if (selected?.id) fetchData();
  }, [selected]);

  if (!billData) return null;

  const estadosFactura = [
    { value: "pendiente", label: "Pendiente" },
    { value: "pagada", label: "Pagada" },
    { value: "vencida", label: "Vencida" },
  ];

  const clientOptions = clientList.map((c) => ({
    value: c.id,
    label: `${c.nombre} ${c.apellido}`,
  }));

  const fields = [
    { name: "numero_factura", label: "Número de factura", type: "text" },
    { name: "concepto", label: "Concepto", type: "text" },
    { name: "monto_facturado", label: "Monto facturado", type: "number" },
    { name: "abonos", label: "Abonos", type: "number" },
    { name: "saldo_pendiente", label: "Saldo pendiente", type: "number" },
    { name: "fecha_factura", label: "Fecha de factura", type: "date" },
    { name: "fecha_vencimiento", label: "Fecha de vencimiento", type: "date" },
    { name: "estado_factura", label: "Estado de factura", type: "select", options: estadosFactura },
    { name: "id_cliente", label: "Cliente asociado", type: "select", options: clientOptions },
  ];

  const initialData = {
    numero_factura: billData.numero_factura || "",
    concepto: billData.concepto || "",
    monto_facturado: billData.monto_facturado || "",
    abonos: billData.abonos || "",
    saldo_pendiente: billData.saldo_pendiente || "",
    fecha_factura: billData.fecha_factura ? billData.fecha_factura.split("T")[0] : "",
    fecha_vencimiento: billData.fecha_vencimiento ? billData.fecha_vencimiento.split("T")[0] : "",
    estado_factura: billData.estado_factura || "pendiente",
    id_cliente: billData.id_cliente || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdateBill(selected.id, data);
  };

  return (
    <BaseEditModal
      title={`Editar factura #${billData.numero_factura}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Factura actualizada exitosamente!"
    />
  );
};

export default EditBillAd;
