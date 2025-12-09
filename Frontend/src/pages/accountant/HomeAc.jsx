import { useEffect, useState, useMemo, useCallback } from "react";
import BaseHome from "../../components/common/BaseHome";
import { ActivityListAc } from "../../components/accountant/ActivityListAc";
import { handleGetListBillAc } from "../../controllers/accountant/getListBillAc.controller";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import useDataCache from "../../hooks/useDataCache";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { 
  faFileInvoiceDollar, 
  faBoxes,
  faCreditCard,
  faExclamationTriangle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const HomeAc = () => {
  // Cargar datos con caché
  const { data: bills, reload: reloadBills, isLoading: loadingBills } = useDataCache(
    'home_ac_bills_cache',
    handleGetListBillAc
  );

  const { data: inventory, reload: reloadInventory, isLoading: loadingInventory } = useDataCache(
    'home_ac_inventory_cache',
    handleGetListInventoryAd
  );

  const { data: paymentAccounts, reload: reloadPaymentAccounts, isLoading: loadingAccounts } = useDataCache(
    'home_ac_accounts_cache',
    handleGetListPaymentAccountAd
  );

  // Combinar estados de carga
  const isLoading = loadingBills || loadingInventory || loadingAccounts;

  // Auto-refresh global para home (recarga todos los datos)
  const reloadAll = useCallback(async () => {
    await Promise.all([
      reloadBills(),
      reloadInventory(),
      reloadPaymentAccounts()
    ]);
  }, [reloadBills, reloadInventory, reloadPaymentAccounts]);

  const { timeAgo, manualRefresh } = useAutoRefresh(reloadAll, 3, 'home_ac');

  // Calcular estadísticas desde los datos cacheados
  const statsData = useMemo(() => {
    const billsData = Array.isArray(bills) ? bills : (bills?.data || []);
    const inventoryData = Array.isArray(inventory) ? inventory : [];
    const accountsData = Array.isArray(paymentAccounts) ? paymentAccounts : [];

    return {
      totalBills: billsData.length,
      pendingBills: billsData.filter(b => b.estado_factura === 'pendiente' || b.estado_factura === 'sin pagar').length,
      paidBills: billsData.filter(b => b.estado_factura === 'pagado' || b.estado_factura === 'pagada').length,
      totalInventory: inventoryData.length,
      totalAccounts: accountsData.length
    };
  }, [bills, inventory, paymentAccounts]);

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

  const billsArray = Array.isArray(bills) ? bills : (bills?.data || []);

  return (
    <BaseHome
      title="Panel de Contabilidad"
      subtitle="Gestiona facturas, pagos y registros contables"
      headerGradient="linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
      stats={stats}
      sectionTitle="Facturas Recientes"
      sectionGradient="linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
      activityComponent={
        billsArray.length === 0 ? null : (
          <ActivityListAc bills={billsArray} />
        )
      }
      notificationCount={2}
      notificationPath="/contador/notificaciones"
      emptyMessage="No tienes ninguna factura asignada por el momento."
      lastUpdateTime={timeAgo}
      onRefresh={manualRefresh}
      isLoading={isLoading}
    />
  );
};

export default HomeAc;