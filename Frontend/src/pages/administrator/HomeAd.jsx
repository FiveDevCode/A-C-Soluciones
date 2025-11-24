import styled from "styled-components";
import ActivityListAd from "../../components/administrator/ActivityListAd";
import { useEffect, useState } from "react";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClipboardCheck, 
  faTools, 
  faUserTie, 
  faCalendarAlt,
  faBoxOpen,
  faUserCircle,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  gap: 1rem;
  padding: 2rem;

  @media (max-width: 1350px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.2rem;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.color || '#1976d2'};
`;

const StatInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const QuickActionCard = styled(Link)`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  svg {
    font-size: 2rem;
    color: #667eea;
  }

  span {
    font-weight: 500;
    font-size: 0.95rem;
    color: #333;
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const HomeAd = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    totalServices: 0,
    totalTechnicians: 0,
    totalVisits: 0,
    totalInventory: 0
  });

  const handleProfileClick = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded.role || decoded.tipo;
      
      if (role === 'administrador') {
        navigate('/admin/perfil');
      } else if (role === 'tecnico') {
        navigate('/tecnico/perfil');
      } else if (role === 'Contador') {
        navigate('/contador/perfil');
      }
    }
  };

  useEffect(() => {
    // Cargar solicitudes
    handleGetListRequest()
      .then((res) => {
        const requestsData = res.data || [];
        setRequests(requestsData);
        
        if (Array.isArray(requestsData)) {
          const pending = requestsData.filter(r => r.estado === 'pendiente').length;
          setStats(prev => ({ ...prev, pendingRequests: pending }));
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
          setStats(prev => ({ ...prev, totalServices: activeServices }));
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
          setStats(prev => ({ ...prev, totalTechnicians: activeTechnicians }));
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
          setStats(prev => ({ ...prev, totalVisits: scheduledVisits }));
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
          setStats(prev => ({ ...prev, totalInventory: availableItems }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar inventario:", err);
      });
  }, []);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <h1>Bienvenido al Panel de Administración</h1>
          <p>Gestiona y supervisa todas las operaciones de tu empresa</p>
        </HeaderLeft>
        <HeaderRight>
          <IconButton onClick={() => navigate('/admin/notificaciones')} title="Notificaciones">
            <FontAwesomeIcon icon={faBell} />
            <NotificationBadge>3</NotificationBadge>
          </IconButton>
          <IconButton onClick={handleProfileClick} title="Mi Perfil">
            <FontAwesomeIcon icon={faUserCircle} />
          </IconButton>
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="#fff3e0" color="#f57c00">
            <FontAwesomeIcon icon={faClipboardCheck} />
          </StatIcon>
          <StatInfo>
            <h3>Solicitudes Pendientes</h3>
            <p>{stats.pendingRequests}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#e8f5e9" color="#388e3c">
            <FontAwesomeIcon icon={faTools} />
          </StatIcon>
          <StatInfo>
            <h3>Servicios Activos</h3>
            <p>{stats.totalServices}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#e3f2fd" color="#1976d2">
            <FontAwesomeIcon icon={faUserTie} />
          </StatIcon>
          <StatInfo>
            <h3>Técnicos Activos</h3>
            <p>{stats.totalTechnicians}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#f3e5f5" color="#7b1fa2">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </StatIcon>
          <StatInfo>
            <h3>Visitas Programadas</h3>
            <p>{stats.totalVisits}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fce4ec" color="#c2185b">
            <FontAwesomeIcon icon={faBoxOpen} />
          </StatIcon>
          <StatInfo>
            <h3>Herramientas Disponibles</h3>
            <p>{stats.totalInventory}</p>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Card>
        <SectionTitle>Solicitudes Recientes</SectionTitle>
        {!Array.isArray(requests) || requests.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem 0" }}>
            No tienes ninguna solicitud asignada por el momento.
          </p>
        ) : (
          <ActivityListAd requests={requests} />
        )}
      </Card>
    </Container>
  );
};

export default HomeAd;