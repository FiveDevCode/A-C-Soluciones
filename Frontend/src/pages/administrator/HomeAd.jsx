import { useEffect, useState } from "react";
import BaseHome from "../../components/common/BaseHome";
import ActivityListAd from "../../components/administrator/ActivityListAd";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import { 
  faClipboardCheck, 
  faTools, 
  faUserTie, 
  faCalendarAlt,
  faBoxOpen
} from "@fortawesome/free-solid-svg-icons";

const HomeAd = () => {
  const [requests, setRequests] = useState([]);
  const [statsData, setStatsData] = useState({
    pendingRequests: 0,
    totalServices: 0,
    totalTechnicians: 0,
    totalVisits: 0,
    totalInventory: 0
  });

  useEffect(() => {
    // Cargar solicitudes
    handleGetListRequest()
      .then((res) => {
        const requestsData = res.data || [];
        setRequests(requestsData);
        
        if (Array.isArray(requestsData)) {
          const pending = requestsData.filter(r => r.estado === 'pendiente').length;
          setStatsData(prev => ({ ...prev, pendingRequests: pending }));
        }
      })
      .catch((err) => {
        console.log("No se pudo obtener el listado de solicitudes", err);
        setRequests([]);
      });

    // Cargar servicios
    handleGetListServiceAd()
      .then((services) => {
        if (Array.isArray(services)) {
          const activeServices = services.filter(s => s.estado === 'activo' || s.estado === 'habilitado').length;
          setStatsData(prev => ({ ...prev, totalServices: activeServices }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar servicios:", err);
      });

    // Cargar técnicos
    handleGetListTechnical()
      .then((res) => {
        const technicians = res.data?.data || res.data || [];
        if (Array.isArray(technicians)) {
          const activeTechnicians = technicians.filter(t => t.estado === 'activo' || t.estado === 'habilitado').length;
          setStatsData(prev => ({ ...prev, totalTechnicians: activeTechnicians }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar técnicos:", err);
      });

    // Cargar visitas
    handleGetListVisitAd()
      .then((res) => {
        const visits = res.data?.data || res.data || [];
        if (Array.isArray(visits)) {
          const scheduledVisits = visits.filter(v => v.estado === 'pendiente' || v.estado === 'programada').length;
          setStatsData(prev => ({ ...prev, totalVisits: scheduledVisits }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar visitas:", err);
      });

    // Cargar inventario
    handleGetListInventoryAd()
      .then((inventory) => {
        if (Array.isArray(inventory)) {
          const availableItems = inventory.filter(i => i.estado_herramienta === 'activo').length;
          setStatsData(prev => ({ ...prev, totalInventory: availableItems }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar inventario:", err);
      });
  }, []);

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
    />
  );
};

export default HomeAd;