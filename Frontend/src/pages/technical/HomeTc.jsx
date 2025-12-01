import { useEffect, useState } from "react";
import BaseHome from "../../components/common/BaseHome";
import ActivityListTc from "../../components/technical/ActivityListTc";
import { handleGetServiceList } from "../../controllers/technical/getServiceListTc.controller";
import { 
  faCompass, 
  faCheckCircle, 
  faClock,
  faSpinner,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

const HomeTc = () => {
  const [visits, setVisits] = useState([]);
  const [statsData, setStatsData] = useState({
    totalVisits: 0,
    programadas: 0,
    completadas: 0,
    enProceso: 0,
    canceladas: 0
  });

  useEffect(() => {
    handleGetServiceList()
      .then((res) => {
        const visitsData = Array.isArray(res.data.data) ? res.data.data : [];
        setVisits(visitsData);
          
          if (Array.isArray(visitsData) && visitsData.length > 0) {
            const total = visitsData.length;
            const programadas = visitsData.filter(v => {
              const estado = v.estado?.toLowerCase();
              return estado === 'programada' || estado === 'pendiente';
            }).length;
            const completadas = visitsData.filter(v => {
              const estado = v.estado?.toLowerCase();
              return estado === 'completada' || estado === 'completado';
            }).length;
            const enProceso = visitsData.filter(v => {
              const estado = v.estado?.toLowerCase();
              return estado === 'iniciada' || estado === 'en_camino' || estado === 'en camino';
            }).length;
            const canceladas = visitsData.filter(v => {
              const estado = v.estado?.toLowerCase();
              return estado === 'cancelada' || estado === 'cancelado';
            }).length;
            
            setStatsData({
              totalVisits: total,
              programadas: programadas,
              completadas: completadas,
              enProceso: enProceso,
              canceladas: canceladas
            });
          } else {
            setStatsData({
              totalVisits: 0,
              programadas: 0,
              completadas: 0,
              enProceso: 0,
              canceladas: 0
            });
          }
        })
      .catch((err) => {
        console.error("Error fetching service list:", err);
        setVisits([]);
      });
  }, []);

  const stats = [
    {
      icon: faCompass,
      bgColor: "#e3f2fd",
      color: "#1976d2",
      label: "Total Visitas",
      value: statsData.totalVisits
    },
    {
      icon: faClock,
      bgColor: "#fff3e0",
      color: "#f57c00",
      label: "Visitas Programadas",
      value: statsData.programadas
    },
    {
      icon: faSpinner,
      bgColor: "#e8f5e9",
      color: "#388e3c",
      label: "En Proceso",
      value: statsData.enProceso
    },
    {
      icon: faCheckCircle,
      bgColor: "#e8f5e9",
      color: "#2e7d32",
      label: "Completadas",
      value: statsData.completadas
    },
    {
      icon: faTimesCircle,
      bgColor: "#ffebee",
      color: "#c62828",
      label: "Canceladas",
      value: statsData.canceladas
    }
  ];

  return (
    <BaseHome
      title="Bienvenido al Panel de Técnico"
      subtitle="Gestiona tus visitas y servicios asignados"
      headerGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      stats={stats}
      sectionTitle="Visitas Recientes"
      sectionGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      activityComponent={<ActivityListTc visits={visits || []} />}
      notificationCount={0}
      notificationPath="/tecnico/notificaciones"
      emptyMessage="No tienes ninguna visita asignada por el momento."
    />
  );
};


export default HomeTc;