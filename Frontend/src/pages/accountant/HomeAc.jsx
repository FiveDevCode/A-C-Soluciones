import { useEffect, useState } from "react";
import BaseHome from "../../components/common/BaseHome";
import { ActivityListAc } from "../../components/accountant/ActivityListAc";
import { handleGetListBillAc } from "../../controllers/accountant/getListBillAc.controller";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import { 
  faFileInvoiceDollar, 
  faBoxes,
  faCreditCard,
  faExclamationTriangle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const HomeAc = () => {
  const [bills, setBills] = useState([]);
  const [statsData, setStatsData] = useState({
    totalBills: 0,
    pendingBills: 0,
    paidBills: 0,
    totalInventory: 0,
    totalAccounts: 0
  });

  useEffect(() => {
    // Cargar facturas
    handleGetListBillAc()
      .then((res) => {
        const billsData = res.data || [];
        setBills(billsData);
        
        if (Array.isArray(billsData)) {
          const total = billsData.length;
          const pending = billsData.filter(b => b.estado_factura === 'pendiente' || b.estado_factura === 'sin pagar').length;
          const paid = billsData.filter(b => b.estado_factura === 'pagado' || b.estado_factura === 'pagada').length;
          
          setStatsData(prev => ({ 
            ...prev, 
            totalBills: total,
            pendingBills: pending,
            paidBills: paid
          }));
        }
      })
      .catch((err) => {
        console.log("Error obteniendo las facturas", err);
        setBills([]);
      });

    // Cargar inventario total
    handleGetListInventoryAd()
      .then((inventory) => {
        if (Array.isArray(inventory)) {
          setStatsData(prev => ({ ...prev, totalInventory: inventory.length }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar inventario:", err);
      });

    // Cargar cuentas de pago registradas
    handleGetListPaymentAccountAd()
      .then((payments) => {
        if (Array.isArray(payments)) {
          setStatsData(prev => ({ ...prev, totalAccounts: payments.length }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar cuentas:", err);
      });
  }, []);

  const stats = [
    {
      icon: faFileInvoiceDollar,
      bgColor: "#fff3e0",
      color: "#f57c00",
      label: "Total Facturas",
      value: statsData.totalBills
    },
    {
      icon: faExclamationTriangle,
      bgColor: "#ffebee",
      color: "#d32f2f",
      label: "Facturas Pendientes",
      value: statsData.pendingBills
    },
    {
      icon: faCheckCircle,
      bgColor: "#e8f5e9",
      color: "#388e3c",
      label: "Facturas Pagadas",
      value: statsData.paidBills
    },
    {
      icon: faBoxes,
      bgColor: "#e3f2fd",
      color: "#1976d2",
      label: "Total Inventario",
      value: statsData.totalInventory
    },
    {
      icon: faCreditCard,
      bgColor: "#f3e5f5",
      color: "#7b1fa2",
      label: "Cuentas Registradas",
      value: statsData.totalAccounts
    }
  ];

  return (
    <BaseHome
      title="Panel de Contabilidad"
      subtitle="Gestiona facturas, pagos y registros contables"
      headerGradient="linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
      stats={stats}
      sectionTitle="Facturas Recientes"
      sectionGradient="linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
      activityComponent={
        !Array.isArray(bills) || bills.length === 0 ? null : (
          <ActivityListAc bills={bills} />
        )
      }
      notificationCount={2}
      notificationPath="/contador/notificaciones"
      emptyMessage="No tienes ninguna factura asignada por el momento."
    />
  );
};

export default HomeAc;