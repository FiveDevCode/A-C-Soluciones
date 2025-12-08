import { useEffect, useState, useMemo, useCallback } from "react";
import BaseHome from "../../components/common/BaseHome";
import ActivityListAd from "../../components/administrator/ActivityListAd";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import useDataCache from "../../hooks/useDataCache";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { 
  faClipboardCheck, 
  faTools, 
  faUserTie, 
  faCalendarAlt,
  faBoxOpen
} from "@fortawesome/free-solid-svg-icons";

const HomeAd = () => {
  // Cargar datos con caché
  const { data: requests, reload: reloadRequests, isLoading: loadingRequests } = useDataCache(
    'home_requests_cache',
    handleGetListRequest
  );

  const { data: services, reload: reloadServices, isLoading: loadingServices } = useDataCache(
    'home_services_cache',
    handleGetListServiceAd
  );

  const { data: technicians, reload: reloadTechnicians, isLoading: loadingTechnicians } = useDataCache(
    'home_technicians_cache',
    handleGetListTechnical
  );

  const { data: visits, reload: reloadVisits, isLoading: loadingVisits } = useDataCache(
    'home_visits_cache',
    handleGetListVisitAd
  );

  const { data: inventory, reload: reloadInventory, isLoading: loadingInventory } = useDataCache(
    'home_inventory_cache',
    handleGetListInventoryAd
  );

  // Combinar estados de carga
  const isLoading = loadingRequests || loadingServices || loadingTechnicians || loadingVisits || loadingInventory;

  // Auto-refresh global para home (recarga todos los datos)
  const reloadAll = useCallback(async () => {
    await Promise.all([
      reloadRequests(),
      reloadServices(),
      reloadTechnicians(),
      reloadVisits(),
      reloadInventory()
    ]);
  }, [reloadRequests, reloadServices, reloadTechnicians, reloadVisits, reloadInventory]);

  const { timeAgo, manualRefresh } = useAutoRefresh(reloadAll, 3, 'home');

  // Calcular estadísticas desde los datos cacheados
  const statsData = useMemo(() => {
    const requestsData = Array.isArray(requests) ? requests : (requests?.data || []);
    const servicesData = Array.isArray(services) ? services : [];
    const techniciansData = Array.isArray(technicians) ? (technicians?.data?.data || technicians?.data || technicians) : [];
    const visitsData = Array.isArray(visits) ? visits : (visits?.data?.data || visits?.data || []);
    const inventoryData = Array.isArray(inventory) ? inventory : [];
    console.log(inventoryData);
    return {
      pendingRequests: requestsData.filter(r => r.estado === 'pendiente').length,
      totalServices: servicesData.filter(s => s.estado === 'activo' || s.estado === 'habilitado').length,
      totalTechnicians: techniciansData.filter(t => t.estado === 'activo' || t.estado === 'habilitado').length,
      totalVisits: visitsData.filter(v => v.estado === 'pendiente' || v.estado === 'programada').length,
      totalInventory: inventoryData.filter(i => i.estado === 'Nueva').length
    };
  }, [requests, services, technicians, visits, inventory]);



  const stats = [
    {
      icon: faClipboardCheck,
      bgColor: "#fff3e0",
      color: "#f57c00",
      label: "Solicitudes Pendientes",
      value: statsData.pendingRequests
    },
    {
      icon: faTools,
      bgColor: "#e8f5e9",
      color: "#388e3c",
      label: "Servicios Activos",
      value: statsData.totalServices
    },
    {
      icon: faUserTie,
      bgColor: "#e3f2fd",
      color: "#1976d2",
      label: "Técnicos Activos",
      value: statsData.totalTechnicians
    },
    {
      icon: faCalendarAlt,
      bgColor: "#f3e5f5",
      color: "#7b1fa2",
      label: "Visitas Programadas",
      value: statsData.totalVisits
    },
    {
      icon: faBoxOpen,
      bgColor: "#fce4ec",
      color: "#c2185b",
      label: "Herramientas Disponibles",
      value: statsData.totalInventory
    }
  ];

  return (
    <BaseHome
      title="Bienvenido al Panel de Administración"
      subtitle="Gestiona y supervisa todas las operaciones de tu empresa"
      headerGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      stats={stats}
      sectionTitle="Solicitudes Recientes"
      sectionGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      activityComponent={
        !Array.isArray(requests) || requests.length === 0 ? null : (
          <ActivityListAd requests={requests} />
        )
      }
      notificationCount={3}
      notificationPath="/admin/notificaciones"
      emptyMessage="No tienes ninguna solicitud asignada por el momento."
      lastUpdateTime={timeAgo}
      onRefresh={manualRefresh}
      isLoading={isLoading}
    />
  );
};

export default HomeAd;